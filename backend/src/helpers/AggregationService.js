class AggregationService {
    constructor(model) {
        this.model = model;
        this.pipeline = [];
        this.hasFacet = false;  // Ensure facet is applied only once
    }

    // Match conditions
    match(conditions = {}) {
        if (Object.keys(conditions).length) {
            this.pipeline.push({ $match: conditions });
        }
        return this;
    }

    // Add lookup stages
    lookup(lookups = []) {
        lookups.forEach(lookup => {
            this.pipeline.push({ $lookup: lookup });
        });
        return this;
    }

    // Unwind fields
    unwind(fields = []) {
        fields.forEach(field => {
            this.pipeline.push({ $unwind: { path: field, preserveNullAndEmptyArrays: true } });
        });
        return this;
    }

    // Select specific fields
    project(select = {}) {
        if (Object.keys(select).length) {
            this.pipeline.push({ $project: select });
        }
        return this;
    }

    // Add sorting
    sort(order = '', dir = 'asc') {
        if (order) {
            this.pipeline.push({ $sort: { [order]: dir === 'asc' ? 1 : -1 } });
        }
        return this;
    }

    // Add pagination
    paginate(skip = 0, limit = 10) {
        this.pipeline.push({ $skip: skip }, { $limit: limit });
        return this;
    }

    // Add facet safely (only once)
    facet() {
        if (!this.hasFacet) {
            this.pipeline = [{
                $facet: {
                    total: [{ $count: "count" }],
                    records: this.pipeline
                }
            }];
            this.hasFacet = true;
        }
        return this;
    }

    // Execute the aggregation
    async execute() {
        try {
             // Debugging
            const result = await this.model.aggregate(this.pipeline);
            return result;
        } catch (error) {
            console.error("Error in aggregation:", error);
            throw error;
        }
    }
}

module.exports = AggregationService;
