interface IGenericRepository<T> {
    create(item: T): Promise<T>;
    findById(id: any): Promise<T | null>;

    /**
     * Finds a single document matching the provided query.
     * 
     * @template T The type of the document to query.
     * @param query An object representing the query. 
     *              Each key of the object corresponds to a field in the type `T`,
     *              and the value specifies the criteria for that field.
     * @returns A promise that resolves to an instance of type `T` if a matching document is found, or null otherwise.
     */
    findOne?(query: Partial<T>): Promise<T | null> 

     /**
     * Finds and delete a single document matching the provided query.
     * 
     * @template T The type of the document to query.
     * @param query An object representing the query. 
     *              Each key of the object corresponds to a field in the type `T`,
     *              and the value specifies the criteria for that field.
     * @returns A promise that resolves to an instance of type `T` if a matching document is found, or null otherwise.
     */
    deleteOne?(query: Partial<T>): Promise<T | null>
  }