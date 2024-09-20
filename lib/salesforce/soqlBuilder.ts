export class SOQLBuilder {
  private fields: string[] = [];
  private fromObject: string = "";
  private whereConditions: string[] = [];
  private orderByFields: string[] = [];
  private limitValue: number | null = null;
  private offsetValue: number | null = null;

  select(...fields: string[]): SOQLBuilder {
    this.fields = fields;
    return this;
  }

  from(object: string): SOQLBuilder {
    this.fromObject = object;
    return this;
  }

  where(condition: string): SOQLBuilder {
    this.whereConditions.push(condition);
    return this;
  }

  andWhere(condition: string): SOQLBuilder {
    if (this.whereConditions.length === 0) {
      return this.where(condition);
    }
    this.whereConditions.push(`AND ${condition}`);
    return this;
  }

  orderBy(field: string, direction: "ASC" | "DESC" = "ASC"): SOQLBuilder {
    this.orderByFields.push(`${field} ${direction}`);
    return this;
  }

  limit(value: number): SOQLBuilder {
    this.limitValue = value;
    return this;
  }

  offset(value: number): SOQLBuilder {
    this.offsetValue = value;
    return this;
  }

  build(): string {
    if (this.fields.length === 0 || !this.fromObject) {
      throw new Error("SELECT and FROM clauses are required");
    }

    let query = `SELECT ${this.fields.join(", ")} FROM ${this.fromObject}`;

    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.join(" ")}`;
    }

    if (this.orderByFields.length > 0) {
      query += ` ORDER BY ${this.orderByFields.join(", ")}`;
    }

    if (this.limitValue !== null) {
      query += ` LIMIT ${this.limitValue}`;
    }

    if (this.offsetValue !== null) {
      query += ` OFFSET ${this.offsetValue}`;
    }

    return query;
  }
}
