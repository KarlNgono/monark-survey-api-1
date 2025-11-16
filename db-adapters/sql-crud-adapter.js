function SqlCrudAdapter(queryExecutorFunction) {

  async function exec(text, params = [], label = null) {
    const start = process.hrtime.bigint();

    try {
      const result = await queryExecutorFunction(text, params);

      if (process.env.DATABASE_LOG === "true") {
        const duration = Number(process.hrtime.bigint() - start) / 1_000_000;
        console.log(
            `[DB] ${label || "query"} (${duration.toFixed(2)} ms)\n`,
            "SQL:", text,
            "\nParams:", params
        );
      }

      return result;
    } catch (err) {
      console.error("[DB ERROR]", err.message, "\nSQL:", text, "\nParams:", params);
      throw err;
    }
  }

  async function retrieve(table, filter = [], options = {}) {
    const values = [];
    let where = "";

    if (filter.length > 0) {
      const cond = filter.map((fi, i) => {
        values.push(fi.value);
        return `${fi.name} ${fi.op} $${i + 1}`;
      });
      where = " WHERE " + cond.join(" AND ");
    }

    let extra = "";
    if (options.orderBy) extra += ` ORDER BY ${options.orderBy}`;
    if (typeof options.limit === "number") {
      values.push(options.limit);
      extra += ` LIMIT $${values.length}`;
    }
    if (typeof options.offset === "number") {
      values.push(options.offset);
      extra += ` OFFSET $${values.length}`;
    }

    const query = `SELECT * FROM ${table}${where}${extra}`;
    const results = await exec(query, values, `SELECT_${table}`);
    return results.rows;
  }

  async function create(table, object) {
    const keys = Object.keys(object);
    const values = Object.values(object);
    const placeholders = keys.map((_, i) => `$${i + 1}`);

    const query = `
      INSERT INTO ${table} (${keys.join(",")})
      VALUES (${placeholders.join(",")})
      RETURNING id
    `;

    const results = await exec(query, values, `INSERT_${table}`);
    return results.rows[0]?.id;
  }

  async function update(table, object) {
    if (!object.id) throw new Error("UPDATE requires object.id");

    const keys = Object.keys(object).filter(k => k !== "id");
    const values = keys.map(k => object[k]);
    values.push(object.id);

    const set = keys.map((k, i) => `${k}=$${i + 1}`).join(", ");
    const query = `UPDATE ${table} SET ${set} WHERE id=$${keys.length + 1}`;

    await exec(query, values, `UPDATE_${table}`);
    return object;
  }

  async function remove(table, id) {
    const query = `DELETE FROM ${table} WHERE id = $1`;
    const result = await exec(query, [id], `DELETE_${table}`);
    return result.rowCount;
  }

  return {
    create,
    retrieve,
    update,
    delete: remove
  };
}

export default SqlCrudAdapter;
