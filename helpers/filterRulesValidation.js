export const validateFilterRules = (rules) => {
    if (!rules || typeof rules !== "object") {
        throw new Error("filterRules doit être un objet");
    }

    const isValidLogic =
        rules.and && Array.isArray(rules.and) ||
        rules.or && Array.isArray(rules.or);

    const hasInvalidFormat =
        rules.op !== undefined || rules.conditions !== undefined;

    if (hasInvalidFormat) {
        throw new Error(
            "Invalid filterRules format use : { and: [ ... ] } ou { or: [ ... ] }"
        );
    }

    if (!isValidLogic) {
        throw new Error(
            "filterRules must contains a array 'and' or 'or'. Example : { and: [...] }"
        );
    }

    const conditions = rules.and || rules.or;

    const allowedOps = ["=", "!=", ">", "<", ">=", "<=", "IN", "NOT IN", "LIKE", "NOT LIKE"];

    for (const cond of conditions) {
        if (!cond.field || !cond.operator) {
            throw new Error(
                "Every conditions must contains : field, operator, value"
            );
        }

        if (!allowedOps.includes(cond.operator)) {
            throw new Error(`Invalid Operator: ${cond.operator}`);
        }
    }

    return true;
};
