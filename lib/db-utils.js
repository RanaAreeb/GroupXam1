const { getDatabase } = require('./db.js');

class DatabaseUtils {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 30000; // 30 seconds cache
    }

    // Optimized query with connection pooling
    async query(collectionName, operation, ...args) {
        try {
            const db = await getDatabase();
            const collection = db.collection(collectionName);
            
            const startTime = Date.now();
            const result = await operation(collection, ...args);
            const queryTime = Date.now() - startTime;
            
            // Log slow queries (> 1 second)
            if (queryTime > 1000) {
                console.warn(`🐌 Slow query detected: ${collectionName} took ${queryTime}ms`);
            }
            
            return result;
        } catch (error) {
            console.error(`Database query error in ${collectionName}:`, error);
            throw error;
        }
    }

    // Cached queries for frequently accessed data
    async cachedQuery(collectionName, operation, cacheKey, ...args) {
        const now = Date.now();
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (now - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
            this.cache.delete(cacheKey);
        }

        // Execute query and cache result
        const result = await this.query(collectionName, operation, ...args);
        this.cache.set(cacheKey, {
            data: result,
            timestamp: now
        });

        return result;
    }

    // Batch operations to reduce connection usage
    async batchInsert(collectionName, documents, options = {}) {
        return await this.query(collectionName, async (collection) => {
            if (documents.length === 0) return { insertedCount: 0 };
            
            // Process in batches of 100 to avoid memory issues
            const batchSize = 100;
            let insertedCount = 0;
            
            for (let i = 0; i < documents.length; i += batchSize) {
                const batch = documents.slice(i, i + batchSize);
                const result = await collection.insertMany(batch, options);
                insertedCount += result.insertedCount;
            }
            
            return { insertedCount };
        });
    }

    // Optimized aggregation pipeline
    async aggregate(collectionName, pipeline, options = {}) {
        return await this.query(collectionName, async (collection) => {
            // Add performance optimization to pipeline
            const optimizedPipeline = [
                ...pipeline,
                { $limit: options.limit || 1000 } // Prevent runaway queries
            ];
            
            return await collection.aggregate(optimizedPipeline, options).toArray();
        });
    }

    // Connection-efficient pagination
    async paginate(collectionName, filter = {}, options = {}) {
        const {
            page = 1,
            limit = 20,
            sort = { _id: -1 },
            projection = null
        } = options;

        const skip = (page - 1) * limit;

        return await this.query(collectionName, async (collection) => {
            const [data, totalCount] = await Promise.all([
                collection
                    .find(filter, projection ? { projection } : {})
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .toArray(),
                collection.countDocuments(filter)
            ]);

            return {
                data,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNext: page < Math.ceil(totalCount / limit),
                    hasPrev: page > 1
                }
            };
        });
    }

    // Clear cache when data changes
    clearCache(pattern = null) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }

    // Get cache statistics
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            memoryUsage: process.memoryUsage()
        };
    }
}

// Singleton instance
const dbUtils = new DatabaseUtils();

module.exports = dbUtils;
