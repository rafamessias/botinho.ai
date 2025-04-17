
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Company
 * 
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>
/**
 * Model CompanyMember
 * 
 */
export type CompanyMember = $Result.DefaultSelection<Prisma.$CompanyMemberPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model RDO
 * 
 */
export type RDO = $Result.DefaultSelection<Prisma.$RDOPayload>
/**
 * Model Incident
 * 
 */
export type Incident = $Result.DefaultSelection<Prisma.$IncidentPayload>
/**
 * Model Media
 * 
 */
export type Media = $Result.DefaultSelection<Prisma.$MediaPayload>
/**
 * Model ProjectOwner
 * 
 */
export type ProjectOwner = $Result.DefaultSelection<Prisma.$ProjectOwnerPayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
  get company(): Prisma.CompanyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.companyMember`: Exposes CRUD operations for the **CompanyMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CompanyMembers
    * const companyMembers = await prisma.companyMember.findMany()
    * ```
    */
  get companyMember(): Prisma.CompanyMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rDO`: Exposes CRUD operations for the **RDO** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RDOS
    * const rDOS = await prisma.rDO.findMany()
    * ```
    */
  get rDO(): Prisma.RDODelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.incident`: Exposes CRUD operations for the **Incident** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Incidents
    * const incidents = await prisma.incident.findMany()
    * ```
    */
  get incident(): Prisma.IncidentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.media`: Exposes CRUD operations for the **Media** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Media
    * const media = await prisma.media.findMany()
    * ```
    */
  get media(): Prisma.MediaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectOwner`: Exposes CRUD operations for the **ProjectOwner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectOwners
    * const projectOwners = await prisma.projectOwner.findMany()
    * ```
    */
  get projectOwner(): Prisma.ProjectOwnerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Company: 'Company',
    CompanyMember: 'CompanyMember',
    Project: 'Project',
    RDO: 'RDO',
    Incident: 'Incident',
    Media: 'Media',
    ProjectOwner: 'ProjectOwner',
    Comment: 'Comment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "company" | "companyMember" | "project" | "rDO" | "incident" | "media" | "projectOwner" | "comment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Company: {
        payload: Prisma.$CompanyPayload<ExtArgs>
        fields: Prisma.CompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findFirst: {
            args: Prisma.CompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findMany: {
            args: Prisma.CompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          create: {
            args: Prisma.CompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          createMany: {
            args: Prisma.CompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          delete: {
            args: Prisma.CompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          update: {
            args: Prisma.CompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          deleteMany: {
            args: Prisma.CompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CompanyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          upsert: {
            args: Prisma.CompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          aggregate: {
            args: Prisma.CompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompany>
          }
          groupBy: {
            args: Prisma.CompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyCountAggregateOutputType> | number
          }
        }
      }
      CompanyMember: {
        payload: Prisma.$CompanyMemberPayload<ExtArgs>
        fields: Prisma.CompanyMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload>
          }
          findFirst: {
            args: Prisma.CompanyMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload>
          }
          findMany: {
            args: Prisma.CompanyMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload>[]
          }
          create: {
            args: Prisma.CompanyMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload>
          }
          createMany: {
            args: Prisma.CompanyMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload>[]
          }
          delete: {
            args: Prisma.CompanyMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload>
          }
          update: {
            args: Prisma.CompanyMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload>
          }
          deleteMany: {
            args: Prisma.CompanyMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CompanyMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload>[]
          }
          upsert: {
            args: Prisma.CompanyMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyMemberPayload>
          }
          aggregate: {
            args: Prisma.CompanyMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompanyMember>
          }
          groupBy: {
            args: Prisma.CompanyMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyMemberCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyMemberCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      RDO: {
        payload: Prisma.$RDOPayload<ExtArgs>
        fields: Prisma.RDOFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RDOFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RDOFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload>
          }
          findFirst: {
            args: Prisma.RDOFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RDOFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload>
          }
          findMany: {
            args: Prisma.RDOFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload>[]
          }
          create: {
            args: Prisma.RDOCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload>
          }
          createMany: {
            args: Prisma.RDOCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RDOCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload>[]
          }
          delete: {
            args: Prisma.RDODeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload>
          }
          update: {
            args: Prisma.RDOUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload>
          }
          deleteMany: {
            args: Prisma.RDODeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RDOUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RDOUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload>[]
          }
          upsert: {
            args: Prisma.RDOUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RDOPayload>
          }
          aggregate: {
            args: Prisma.RDOAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRDO>
          }
          groupBy: {
            args: Prisma.RDOGroupByArgs<ExtArgs>
            result: $Utils.Optional<RDOGroupByOutputType>[]
          }
          count: {
            args: Prisma.RDOCountArgs<ExtArgs>
            result: $Utils.Optional<RDOCountAggregateOutputType> | number
          }
        }
      }
      Incident: {
        payload: Prisma.$IncidentPayload<ExtArgs>
        fields: Prisma.IncidentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IncidentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IncidentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>
          }
          findFirst: {
            args: Prisma.IncidentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IncidentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>
          }
          findMany: {
            args: Prisma.IncidentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>[]
          }
          create: {
            args: Prisma.IncidentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>
          }
          createMany: {
            args: Prisma.IncidentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IncidentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>[]
          }
          delete: {
            args: Prisma.IncidentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>
          }
          update: {
            args: Prisma.IncidentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>
          }
          deleteMany: {
            args: Prisma.IncidentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IncidentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IncidentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>[]
          }
          upsert: {
            args: Prisma.IncidentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IncidentPayload>
          }
          aggregate: {
            args: Prisma.IncidentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIncident>
          }
          groupBy: {
            args: Prisma.IncidentGroupByArgs<ExtArgs>
            result: $Utils.Optional<IncidentGroupByOutputType>[]
          }
          count: {
            args: Prisma.IncidentCountArgs<ExtArgs>
            result: $Utils.Optional<IncidentCountAggregateOutputType> | number
          }
        }
      }
      Media: {
        payload: Prisma.$MediaPayload<ExtArgs>
        fields: Prisma.MediaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MediaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MediaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          findFirst: {
            args: Prisma.MediaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MediaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          findMany: {
            args: Prisma.MediaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>[]
          }
          create: {
            args: Prisma.MediaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          createMany: {
            args: Prisma.MediaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MediaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>[]
          }
          delete: {
            args: Prisma.MediaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          update: {
            args: Prisma.MediaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          deleteMany: {
            args: Prisma.MediaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MediaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MediaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>[]
          }
          upsert: {
            args: Prisma.MediaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaPayload>
          }
          aggregate: {
            args: Prisma.MediaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMedia>
          }
          groupBy: {
            args: Prisma.MediaGroupByArgs<ExtArgs>
            result: $Utils.Optional<MediaGroupByOutputType>[]
          }
          count: {
            args: Prisma.MediaCountArgs<ExtArgs>
            result: $Utils.Optional<MediaCountAggregateOutputType> | number
          }
        }
      }
      ProjectOwner: {
        payload: Prisma.$ProjectOwnerPayload<ExtArgs>
        fields: Prisma.ProjectOwnerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectOwnerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectOwnerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload>
          }
          findFirst: {
            args: Prisma.ProjectOwnerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectOwnerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload>
          }
          findMany: {
            args: Prisma.ProjectOwnerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload>[]
          }
          create: {
            args: Prisma.ProjectOwnerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload>
          }
          createMany: {
            args: Prisma.ProjectOwnerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectOwnerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload>[]
          }
          delete: {
            args: Prisma.ProjectOwnerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload>
          }
          update: {
            args: Prisma.ProjectOwnerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload>
          }
          deleteMany: {
            args: Prisma.ProjectOwnerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectOwnerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectOwnerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload>[]
          }
          upsert: {
            args: Prisma.ProjectOwnerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectOwnerPayload>
          }
          aggregate: {
            args: Prisma.ProjectOwnerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectOwner>
          }
          groupBy: {
            args: Prisma.ProjectOwnerGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectOwnerGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectOwnerCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectOwnerCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    company?: CompanyOmit
    companyMember?: CompanyMemberOmit
    project?: ProjectOmit
    rDO?: RDOOmit
    incident?: IncidentOmit
    media?: MediaOmit
    projectOwner?: ProjectOwnerOmit
    comment?: CommentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    comments: number
    companyMemberships: number
    rdos: number
    incidents: number
    projectOwners: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | UserCountOutputTypeCountCommentsArgs
    companyMemberships?: boolean | UserCountOutputTypeCountCompanyMembershipsArgs
    rdos?: boolean | UserCountOutputTypeCountRdosArgs
    incidents?: boolean | UserCountOutputTypeCountIncidentsArgs
    projectOwners?: boolean | UserCountOutputTypeCountProjectOwnersArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCompanyMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRdosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RDOWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountIncidentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IncidentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectOwnersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectOwnerWhereInput
  }


  /**
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    users: number
    projects: number
    members: number
    media: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | CompanyCountOutputTypeCountUsersArgs
    projects?: boolean | CompanyCountOutputTypeCountProjectsArgs
    members?: boolean | CompanyCountOutputTypeCountMembersArgs
    media?: boolean | CompanyCountOutputTypeCountMediaArgs
  }

  // Custom InputTypes
  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyCountOutputType
     */
    select?: CompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyMemberWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountMediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    comments: number
    rdos: number
    incidents: number
    media: number
    owners: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | ProjectCountOutputTypeCountCommentsArgs
    rdos?: boolean | ProjectCountOutputTypeCountRdosArgs
    incidents?: boolean | ProjectCountOutputTypeCountIncidentsArgs
    media?: boolean | ProjectCountOutputTypeCountMediaArgs
    owners?: boolean | ProjectCountOutputTypeCountOwnersArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountRdosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RDOWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountIncidentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IncidentWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountMediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountOwnersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectOwnerWhereInput
  }


  /**
   * Count Type RDOCountOutputType
   */

  export type RDOCountOutputType = {
    comments: number
    media: number
  }

  export type RDOCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | RDOCountOutputTypeCountCommentsArgs
    media?: boolean | RDOCountOutputTypeCountMediaArgs
  }

  // Custom InputTypes
  /**
   * RDOCountOutputType without action
   */
  export type RDOCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDOCountOutputType
     */
    select?: RDOCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RDOCountOutputType without action
   */
  export type RDOCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * RDOCountOutputType without action
   */
  export type RDOCountOutputTypeCountMediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaWhereInput
  }


  /**
   * Count Type IncidentCountOutputType
   */

  export type IncidentCountOutputType = {
    comments: number
    media: number
  }

  export type IncidentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | IncidentCountOutputTypeCountCommentsArgs
    media?: boolean | IncidentCountOutputTypeCountMediaArgs
  }

  // Custom InputTypes
  /**
   * IncidentCountOutputType without action
   */
  export type IncidentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IncidentCountOutputType
     */
    select?: IncidentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * IncidentCountOutputType without action
   */
  export type IncidentCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * IncidentCountOutputType without action
   */
  export type IncidentCountOutputTypeCountMediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    clerkId: string | null
    email: string | null
    phone: string | null
    firstName: string | null
    lastName: string | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
    companyId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    clerkId: string | null
    email: string | null
    phone: string | null
    firstName: string | null
    lastName: string | null
    avatar: string | null
    createdAt: Date | null
    updatedAt: Date | null
    companyId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    clerkId: number
    email: number
    phone: number
    firstName: number
    lastName: number
    avatar: number
    createdAt: number
    updatedAt: number
    companyId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    clerkId?: true
    email?: true
    phone?: true
    firstName?: true
    lastName?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    companyId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    clerkId?: true
    email?: true
    phone?: true
    firstName?: true
    lastName?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    companyId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    clerkId?: true
    email?: true
    phone?: true
    firstName?: true
    lastName?: true
    avatar?: true
    createdAt?: true
    updatedAt?: true
    companyId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    clerkId: string
    email: string
    phone: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
    createdAt: Date
    updatedAt: Date
    companyId: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkId?: boolean
    email?: boolean
    phone?: boolean
    firstName?: boolean
    lastName?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    companyId?: boolean
    comments?: boolean | User$commentsArgs<ExtArgs>
    company?: boolean | User$companyArgs<ExtArgs>
    companyMemberships?: boolean | User$companyMembershipsArgs<ExtArgs>
    rdos?: boolean | User$rdosArgs<ExtArgs>
    incidents?: boolean | User$incidentsArgs<ExtArgs>
    projectOwners?: boolean | User$projectOwnersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkId?: boolean
    email?: boolean
    phone?: boolean
    firstName?: boolean
    lastName?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    companyId?: boolean
    company?: boolean | User$companyArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clerkId?: boolean
    email?: boolean
    phone?: boolean
    firstName?: boolean
    lastName?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    companyId?: boolean
    company?: boolean | User$companyArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    clerkId?: boolean
    email?: boolean
    phone?: boolean
    firstName?: boolean
    lastName?: boolean
    avatar?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    companyId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clerkId" | "email" | "phone" | "firstName" | "lastName" | "avatar" | "createdAt" | "updatedAt" | "companyId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | User$commentsArgs<ExtArgs>
    company?: boolean | User$companyArgs<ExtArgs>
    companyMemberships?: boolean | User$companyMembershipsArgs<ExtArgs>
    rdos?: boolean | User$rdosArgs<ExtArgs>
    incidents?: boolean | User$incidentsArgs<ExtArgs>
    projectOwners?: boolean | User$projectOwnersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | User$companyArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | User$companyArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      comments: Prisma.$CommentPayload<ExtArgs>[]
      company: Prisma.$CompanyPayload<ExtArgs> | null
      companyMemberships: Prisma.$CompanyMemberPayload<ExtArgs>[]
      rdos: Prisma.$RDOPayload<ExtArgs>[]
      incidents: Prisma.$IncidentPayload<ExtArgs>[]
      projectOwners: Prisma.$ProjectOwnerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clerkId: string
      email: string
      phone: string
      firstName: string | null
      lastName: string | null
      avatar: string | null
      createdAt: Date
      updatedAt: Date
      companyId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    comments<T extends User$commentsArgs<ExtArgs> = {}>(args?: Subset<T, User$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    company<T extends User$companyArgs<ExtArgs> = {}>(args?: Subset<T, User$companyArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    companyMemberships<T extends User$companyMembershipsArgs<ExtArgs> = {}>(args?: Subset<T, User$companyMembershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    rdos<T extends User$rdosArgs<ExtArgs> = {}>(args?: Subset<T, User$rdosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    incidents<T extends User$incidentsArgs<ExtArgs> = {}>(args?: Subset<T, User$incidentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projectOwners<T extends User$projectOwnersArgs<ExtArgs> = {}>(args?: Subset<T, User$projectOwnersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly clerkId: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly companyId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.comments
   */
  export type User$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * User.company
   */
  export type User$companyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    where?: CompanyWhereInput
  }

  /**
   * User.companyMemberships
   */
  export type User$companyMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    where?: CompanyMemberWhereInput
    orderBy?: CompanyMemberOrderByWithRelationInput | CompanyMemberOrderByWithRelationInput[]
    cursor?: CompanyMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompanyMemberScalarFieldEnum | CompanyMemberScalarFieldEnum[]
  }

  /**
   * User.rdos
   */
  export type User$rdosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    where?: RDOWhereInput
    orderBy?: RDOOrderByWithRelationInput | RDOOrderByWithRelationInput[]
    cursor?: RDOWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RDOScalarFieldEnum | RDOScalarFieldEnum[]
  }

  /**
   * User.incidents
   */
  export type User$incidentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    where?: IncidentWhereInput
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[]
    cursor?: IncidentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IncidentScalarFieldEnum | IncidentScalarFieldEnum[]
  }

  /**
   * User.projectOwners
   */
  export type User$projectOwnersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    where?: ProjectOwnerWhereInput
    orderBy?: ProjectOwnerOrderByWithRelationInput | ProjectOwnerOrderByWithRelationInput[]
    cursor?: ProjectOwnerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectOwnerScalarFieldEnum | ProjectOwnerScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyMinAggregateOutputType = {
    id: string | null
    name: string | null
    document: string | null
    documentType: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    logoUrl: string | null
    coverUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    document: string | null
    documentType: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    logoUrl: string | null
    coverUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyCountAggregateOutputType = {
    id: number
    name: number
    document: number
    documentType: number
    address: number
    city: number
    state: number
    zipCode: number
    logoUrl: number
    coverUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CompanyMinAggregateInputType = {
    id?: true
    name?: true
    document?: true
    documentType?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    logoUrl?: true
    coverUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyMaxAggregateInputType = {
    id?: true
    name?: true
    document?: true
    documentType?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    logoUrl?: true
    coverUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyCountAggregateInputType = {
    id?: true
    name?: true
    document?: true
    documentType?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    logoUrl?: true
    coverUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Company to aggregate.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Companies
    **/
    _count?: true | CompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMaxAggregateInputType
  }

  export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany[P]>
      : GetScalarType<T[P], AggregateCompany[P]>
  }




  export type CompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[]
    by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum
    having?: CompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyCountAggregateInputType | true
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    id: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl: string | null
    coverUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyGroupByOutputType[P]>
        }
      >
    >


  export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    document?: boolean
    documentType?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    logoUrl?: boolean
    coverUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    users?: boolean | Company$usersArgs<ExtArgs>
    projects?: boolean | Company$projectsArgs<ExtArgs>
    members?: boolean | Company$membersArgs<ExtArgs>
    media?: boolean | Company$mediaArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    document?: boolean
    documentType?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    logoUrl?: boolean
    coverUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    document?: boolean
    documentType?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    logoUrl?: boolean
    coverUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectScalar = {
    id?: boolean
    name?: boolean
    document?: boolean
    documentType?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    logoUrl?: boolean
    coverUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "document" | "documentType" | "address" | "city" | "state" | "zipCode" | "logoUrl" | "coverUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["company"]>
  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Company$usersArgs<ExtArgs>
    projects?: boolean | Company$projectsArgs<ExtArgs>
    members?: boolean | Company$membersArgs<ExtArgs>
    media?: boolean | Company$mediaArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CompanyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      members: Prisma.$CompanyMemberPayload<ExtArgs>[]
      media: Prisma.$MediaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      document: string
      documentType: string
      address: string
      city: string
      state: string
      zipCode: string
      logoUrl: string | null
      coverUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["company"]>
    composites: {}
  }

  type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = $Result.GetResult<Prisma.$CompanyPayload, S>

  type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompanyCountAggregateInputType | true
    }

  export interface CompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Company'], meta: { name: 'Company' } }
    /**
     * Find zero or one Company that matches the filter.
     * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyFindUniqueArgs>(args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Company that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyFindFirstArgs>(args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.company.findMany()
     * 
     * // Get first 10 Companies
     * const companies = await prisma.company.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyWithIdOnly = await prisma.company.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyFindManyArgs>(args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Company.
     * @param {CompanyCreateArgs} args - Arguments to create a Company.
     * @example
     * // Create one Company
     * const Company = await prisma.company.create({
     *   data: {
     *     // ... data to create a Company
     *   }
     * })
     * 
     */
    create<T extends CompanyCreateArgs>(args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Companies.
     * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyCreateManyArgs>(args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Companies and returns the data saved in the database.
     * @param {CompanyCreateManyAndReturnArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Company.
     * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
     * @example
     * // Delete one Company
     * const Company = await prisma.company.delete({
     *   where: {
     *     // ... filter to delete one Company
     *   }
     * })
     * 
     */
    delete<T extends CompanyDeleteArgs>(args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Company.
     * @param {CompanyUpdateArgs} args - Arguments to update one Company.
     * @example
     * // Update one Company
     * const company = await prisma.company.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyUpdateArgs>(args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Companies.
     * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.company.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyDeleteManyArgs>(args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyUpdateManyArgs>(args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies and returns the data updated in the database.
     * @param {CompanyUpdateManyAndReturnArgs} args - Arguments to update many Companies.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CompanyUpdateManyAndReturnArgs>(args: SelectSubset<T, CompanyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Company.
     * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
     * @example
     * // Update or create a Company
     * const company = await prisma.company.upsert({
     *   create: {
     *     // ... data to create a Company
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company we want to update
     *   }
     * })
     */
    upsert<T extends CompanyUpsertArgs>(args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.company.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
    **/
    count<T extends CompanyCountArgs>(
      args?: Subset<T, CompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanyAggregateArgs>(args: Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>

    /**
     * Group by Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyGroupByArgs['orderBy'] }
        : { orderBy?: CompanyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Company model
   */
  readonly fields: CompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Company.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Company$usersArgs<ExtArgs> = {}>(args?: Subset<T, Company$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projects<T extends Company$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Company$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    members<T extends Company$membersArgs<ExtArgs> = {}>(args?: Subset<T, Company$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    media<T extends Company$mediaArgs<ExtArgs> = {}>(args?: Subset<T, Company$mediaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Company model
   */
  interface CompanyFieldRefs {
    readonly id: FieldRef<"Company", 'String'>
    readonly name: FieldRef<"Company", 'String'>
    readonly document: FieldRef<"Company", 'String'>
    readonly documentType: FieldRef<"Company", 'String'>
    readonly address: FieldRef<"Company", 'String'>
    readonly city: FieldRef<"Company", 'String'>
    readonly state: FieldRef<"Company", 'String'>
    readonly zipCode: FieldRef<"Company", 'String'>
    readonly logoUrl: FieldRef<"Company", 'String'>
    readonly coverUrl: FieldRef<"Company", 'String'>
    readonly createdAt: FieldRef<"Company", 'DateTime'>
    readonly updatedAt: FieldRef<"Company", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Company findUnique
   */
  export type CompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findUniqueOrThrow
   */
  export type CompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findFirst
   */
  export type CompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findFirstOrThrow
   */
  export type CompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findMany
   */
  export type CompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Companies to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company create
   */
  export type CompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Company.
     */
    data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
  }

  /**
   * Company createMany
   */
  export type CompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company createManyAndReturn
   */
  export type CompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company update
   */
  export type CompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Company.
     */
    data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
    /**
     * Choose, which Company to update.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company updateMany
   */
  export type CompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to update.
     */
    limit?: number
  }

  /**
   * Company updateManyAndReturn
   */
  export type CompanyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to update.
     */
    limit?: number
  }

  /**
   * Company upsert
   */
  export type CompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Company to update in case it exists.
     */
    where: CompanyWhereUniqueInput
    /**
     * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
     */
    create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
    /**
     * In case the Company was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
  }

  /**
   * Company delete
   */
  export type CompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter which Company to delete.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company deleteMany
   */
  export type CompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Companies to delete
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to delete.
     */
    limit?: number
  }

  /**
   * Company.users
   */
  export type Company$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Company.projects
   */
  export type Company$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Company.members
   */
  export type Company$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    where?: CompanyMemberWhereInput
    orderBy?: CompanyMemberOrderByWithRelationInput | CompanyMemberOrderByWithRelationInput[]
    cursor?: CompanyMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CompanyMemberScalarFieldEnum | CompanyMemberScalarFieldEnum[]
  }

  /**
   * Company.media
   */
  export type Company$mediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    where?: MediaWhereInput
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    cursor?: MediaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Company without action
   */
  export type CompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
  }


  /**
   * Model CompanyMember
   */

  export type AggregateCompanyMember = {
    _count: CompanyMemberCountAggregateOutputType | null
    _min: CompanyMemberMinAggregateOutputType | null
    _max: CompanyMemberMaxAggregateOutputType | null
  }

  export type CompanyMemberMinAggregateOutputType = {
    id: string | null
    companyId: string | null
    userId: string | null
    role: string | null
    isAdmin: boolean | null
    canPost: boolean | null
    createdAt: Date | null
  }

  export type CompanyMemberMaxAggregateOutputType = {
    id: string | null
    companyId: string | null
    userId: string | null
    role: string | null
    isAdmin: boolean | null
    canPost: boolean | null
    createdAt: Date | null
  }

  export type CompanyMemberCountAggregateOutputType = {
    id: number
    companyId: number
    userId: number
    role: number
    isAdmin: number
    canPost: number
    createdAt: number
    _all: number
  }


  export type CompanyMemberMinAggregateInputType = {
    id?: true
    companyId?: true
    userId?: true
    role?: true
    isAdmin?: true
    canPost?: true
    createdAt?: true
  }

  export type CompanyMemberMaxAggregateInputType = {
    id?: true
    companyId?: true
    userId?: true
    role?: true
    isAdmin?: true
    canPost?: true
    createdAt?: true
  }

  export type CompanyMemberCountAggregateInputType = {
    id?: true
    companyId?: true
    userId?: true
    role?: true
    isAdmin?: true
    canPost?: true
    createdAt?: true
    _all?: true
  }

  export type CompanyMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanyMember to aggregate.
     */
    where?: CompanyMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyMembers to fetch.
     */
    orderBy?: CompanyMemberOrderByWithRelationInput | CompanyMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CompanyMembers
    **/
    _count?: true | CompanyMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMemberMaxAggregateInputType
  }

  export type GetCompanyMemberAggregateType<T extends CompanyMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateCompanyMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompanyMember[P]>
      : GetScalarType<T[P], AggregateCompanyMember[P]>
  }




  export type CompanyMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyMemberWhereInput
    orderBy?: CompanyMemberOrderByWithAggregationInput | CompanyMemberOrderByWithAggregationInput[]
    by: CompanyMemberScalarFieldEnum[] | CompanyMemberScalarFieldEnum
    having?: CompanyMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyMemberCountAggregateInputType | true
    _min?: CompanyMemberMinAggregateInputType
    _max?: CompanyMemberMaxAggregateInputType
  }

  export type CompanyMemberGroupByOutputType = {
    id: string
    companyId: string
    userId: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt: Date
    _count: CompanyMemberCountAggregateOutputType | null
    _min: CompanyMemberMinAggregateOutputType | null
    _max: CompanyMemberMaxAggregateOutputType | null
  }

  type GetCompanyMemberGroupByPayload<T extends CompanyMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyMemberGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyMemberGroupByOutputType[P]>
        }
      >
    >


  export type CompanyMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    userId?: boolean
    role?: boolean
    isAdmin?: boolean
    canPost?: boolean
    createdAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyMember"]>

  export type CompanyMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    userId?: boolean
    role?: boolean
    isAdmin?: boolean
    canPost?: boolean
    createdAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyMember"]>

  export type CompanyMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    userId?: boolean
    role?: boolean
    isAdmin?: boolean
    canPost?: boolean
    createdAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyMember"]>

  export type CompanyMemberSelectScalar = {
    id?: boolean
    companyId?: boolean
    userId?: boolean
    role?: boolean
    isAdmin?: boolean
    canPost?: boolean
    createdAt?: boolean
  }

  export type CompanyMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyId" | "userId" | "role" | "isAdmin" | "canPost" | "createdAt", ExtArgs["result"]["companyMember"]>
  export type CompanyMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CompanyMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CompanyMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CompanyMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CompanyMember"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyId: string
      userId: string
      role: string
      isAdmin: boolean
      canPost: boolean
      createdAt: Date
    }, ExtArgs["result"]["companyMember"]>
    composites: {}
  }

  type CompanyMemberGetPayload<S extends boolean | null | undefined | CompanyMemberDefaultArgs> = $Result.GetResult<Prisma.$CompanyMemberPayload, S>

  type CompanyMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompanyMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompanyMemberCountAggregateInputType | true
    }

  export interface CompanyMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CompanyMember'], meta: { name: 'CompanyMember' } }
    /**
     * Find zero or one CompanyMember that matches the filter.
     * @param {CompanyMemberFindUniqueArgs} args - Arguments to find a CompanyMember
     * @example
     * // Get one CompanyMember
     * const companyMember = await prisma.companyMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyMemberFindUniqueArgs>(args: SelectSubset<T, CompanyMemberFindUniqueArgs<ExtArgs>>): Prisma__CompanyMemberClient<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CompanyMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompanyMemberFindUniqueOrThrowArgs} args - Arguments to find a CompanyMember
     * @example
     * // Get one CompanyMember
     * const companyMember = await prisma.companyMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyMemberClient<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompanyMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyMemberFindFirstArgs} args - Arguments to find a CompanyMember
     * @example
     * // Get one CompanyMember
     * const companyMember = await prisma.companyMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyMemberFindFirstArgs>(args?: SelectSubset<T, CompanyMemberFindFirstArgs<ExtArgs>>): Prisma__CompanyMemberClient<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CompanyMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyMemberFindFirstOrThrowArgs} args - Arguments to find a CompanyMember
     * @example
     * // Get one CompanyMember
     * const companyMember = await prisma.companyMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyMemberClient<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CompanyMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CompanyMembers
     * const companyMembers = await prisma.companyMember.findMany()
     * 
     * // Get first 10 CompanyMembers
     * const companyMembers = await prisma.companyMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyMemberWithIdOnly = await prisma.companyMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyMemberFindManyArgs>(args?: SelectSubset<T, CompanyMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CompanyMember.
     * @param {CompanyMemberCreateArgs} args - Arguments to create a CompanyMember.
     * @example
     * // Create one CompanyMember
     * const CompanyMember = await prisma.companyMember.create({
     *   data: {
     *     // ... data to create a CompanyMember
     *   }
     * })
     * 
     */
    create<T extends CompanyMemberCreateArgs>(args: SelectSubset<T, CompanyMemberCreateArgs<ExtArgs>>): Prisma__CompanyMemberClient<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CompanyMembers.
     * @param {CompanyMemberCreateManyArgs} args - Arguments to create many CompanyMembers.
     * @example
     * // Create many CompanyMembers
     * const companyMember = await prisma.companyMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyMemberCreateManyArgs>(args?: SelectSubset<T, CompanyMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CompanyMembers and returns the data saved in the database.
     * @param {CompanyMemberCreateManyAndReturnArgs} args - Arguments to create many CompanyMembers.
     * @example
     * // Create many CompanyMembers
     * const companyMember = await prisma.companyMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CompanyMembers and only return the `id`
     * const companyMemberWithIdOnly = await prisma.companyMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CompanyMember.
     * @param {CompanyMemberDeleteArgs} args - Arguments to delete one CompanyMember.
     * @example
     * // Delete one CompanyMember
     * const CompanyMember = await prisma.companyMember.delete({
     *   where: {
     *     // ... filter to delete one CompanyMember
     *   }
     * })
     * 
     */
    delete<T extends CompanyMemberDeleteArgs>(args: SelectSubset<T, CompanyMemberDeleteArgs<ExtArgs>>): Prisma__CompanyMemberClient<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CompanyMember.
     * @param {CompanyMemberUpdateArgs} args - Arguments to update one CompanyMember.
     * @example
     * // Update one CompanyMember
     * const companyMember = await prisma.companyMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyMemberUpdateArgs>(args: SelectSubset<T, CompanyMemberUpdateArgs<ExtArgs>>): Prisma__CompanyMemberClient<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CompanyMembers.
     * @param {CompanyMemberDeleteManyArgs} args - Arguments to filter CompanyMembers to delete.
     * @example
     * // Delete a few CompanyMembers
     * const { count } = await prisma.companyMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyMemberDeleteManyArgs>(args?: SelectSubset<T, CompanyMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompanyMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CompanyMembers
     * const companyMember = await prisma.companyMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyMemberUpdateManyArgs>(args: SelectSubset<T, CompanyMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompanyMembers and returns the data updated in the database.
     * @param {CompanyMemberUpdateManyAndReturnArgs} args - Arguments to update many CompanyMembers.
     * @example
     * // Update many CompanyMembers
     * const companyMember = await prisma.companyMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CompanyMembers and only return the `id`
     * const companyMemberWithIdOnly = await prisma.companyMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CompanyMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, CompanyMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CompanyMember.
     * @param {CompanyMemberUpsertArgs} args - Arguments to update or create a CompanyMember.
     * @example
     * // Update or create a CompanyMember
     * const companyMember = await prisma.companyMember.upsert({
     *   create: {
     *     // ... data to create a CompanyMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CompanyMember we want to update
     *   }
     * })
     */
    upsert<T extends CompanyMemberUpsertArgs>(args: SelectSubset<T, CompanyMemberUpsertArgs<ExtArgs>>): Prisma__CompanyMemberClient<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CompanyMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyMemberCountArgs} args - Arguments to filter CompanyMembers to count.
     * @example
     * // Count the number of CompanyMembers
     * const count = await prisma.companyMember.count({
     *   where: {
     *     // ... the filter for the CompanyMembers we want to count
     *   }
     * })
    **/
    count<T extends CompanyMemberCountArgs>(
      args?: Subset<T, CompanyMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CompanyMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanyMemberAggregateArgs>(args: Subset<T, CompanyMemberAggregateArgs>): Prisma.PrismaPromise<GetCompanyMemberAggregateType<T>>

    /**
     * Group by CompanyMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanyMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyMemberGroupByArgs['orderBy'] }
        : { orderBy?: CompanyMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanyMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CompanyMember model
   */
  readonly fields: CompanyMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CompanyMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CompanyMember model
   */
  interface CompanyMemberFieldRefs {
    readonly id: FieldRef<"CompanyMember", 'String'>
    readonly companyId: FieldRef<"CompanyMember", 'String'>
    readonly userId: FieldRef<"CompanyMember", 'String'>
    readonly role: FieldRef<"CompanyMember", 'String'>
    readonly isAdmin: FieldRef<"CompanyMember", 'Boolean'>
    readonly canPost: FieldRef<"CompanyMember", 'Boolean'>
    readonly createdAt: FieldRef<"CompanyMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CompanyMember findUnique
   */
  export type CompanyMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    /**
     * Filter, which CompanyMember to fetch.
     */
    where: CompanyMemberWhereUniqueInput
  }

  /**
   * CompanyMember findUniqueOrThrow
   */
  export type CompanyMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    /**
     * Filter, which CompanyMember to fetch.
     */
    where: CompanyMemberWhereUniqueInput
  }

  /**
   * CompanyMember findFirst
   */
  export type CompanyMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    /**
     * Filter, which CompanyMember to fetch.
     */
    where?: CompanyMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyMembers to fetch.
     */
    orderBy?: CompanyMemberOrderByWithRelationInput | CompanyMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanyMembers.
     */
    cursor?: CompanyMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanyMembers.
     */
    distinct?: CompanyMemberScalarFieldEnum | CompanyMemberScalarFieldEnum[]
  }

  /**
   * CompanyMember findFirstOrThrow
   */
  export type CompanyMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    /**
     * Filter, which CompanyMember to fetch.
     */
    where?: CompanyMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyMembers to fetch.
     */
    orderBy?: CompanyMemberOrderByWithRelationInput | CompanyMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanyMembers.
     */
    cursor?: CompanyMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanyMembers.
     */
    distinct?: CompanyMemberScalarFieldEnum | CompanyMemberScalarFieldEnum[]
  }

  /**
   * CompanyMember findMany
   */
  export type CompanyMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    /**
     * Filter, which CompanyMembers to fetch.
     */
    where?: CompanyMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanyMembers to fetch.
     */
    orderBy?: CompanyMemberOrderByWithRelationInput | CompanyMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CompanyMembers.
     */
    cursor?: CompanyMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanyMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanyMembers.
     */
    skip?: number
    distinct?: CompanyMemberScalarFieldEnum | CompanyMemberScalarFieldEnum[]
  }

  /**
   * CompanyMember create
   */
  export type CompanyMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a CompanyMember.
     */
    data: XOR<CompanyMemberCreateInput, CompanyMemberUncheckedCreateInput>
  }

  /**
   * CompanyMember createMany
   */
  export type CompanyMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CompanyMembers.
     */
    data: CompanyMemberCreateManyInput | CompanyMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompanyMember createManyAndReturn
   */
  export type CompanyMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * The data used to create many CompanyMembers.
     */
    data: CompanyMemberCreateManyInput | CompanyMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CompanyMember update
   */
  export type CompanyMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a CompanyMember.
     */
    data: XOR<CompanyMemberUpdateInput, CompanyMemberUncheckedUpdateInput>
    /**
     * Choose, which CompanyMember to update.
     */
    where: CompanyMemberWhereUniqueInput
  }

  /**
   * CompanyMember updateMany
   */
  export type CompanyMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CompanyMembers.
     */
    data: XOR<CompanyMemberUpdateManyMutationInput, CompanyMemberUncheckedUpdateManyInput>
    /**
     * Filter which CompanyMembers to update
     */
    where?: CompanyMemberWhereInput
    /**
     * Limit how many CompanyMembers to update.
     */
    limit?: number
  }

  /**
   * CompanyMember updateManyAndReturn
   */
  export type CompanyMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * The data used to update CompanyMembers.
     */
    data: XOR<CompanyMemberUpdateManyMutationInput, CompanyMemberUncheckedUpdateManyInput>
    /**
     * Filter which CompanyMembers to update
     */
    where?: CompanyMemberWhereInput
    /**
     * Limit how many CompanyMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CompanyMember upsert
   */
  export type CompanyMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the CompanyMember to update in case it exists.
     */
    where: CompanyMemberWhereUniqueInput
    /**
     * In case the CompanyMember found by the `where` argument doesn't exist, create a new CompanyMember with this data.
     */
    create: XOR<CompanyMemberCreateInput, CompanyMemberUncheckedCreateInput>
    /**
     * In case the CompanyMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyMemberUpdateInput, CompanyMemberUncheckedUpdateInput>
  }

  /**
   * CompanyMember delete
   */
  export type CompanyMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
    /**
     * Filter which CompanyMember to delete.
     */
    where: CompanyMemberWhereUniqueInput
  }

  /**
   * CompanyMember deleteMany
   */
  export type CompanyMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanyMembers to delete
     */
    where?: CompanyMemberWhereInput
    /**
     * Limit how many CompanyMembers to delete.
     */
    limit?: number
  }

  /**
   * CompanyMember without action
   */
  export type CompanyMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyMember
     */
    select?: CompanyMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CompanyMember
     */
    omit?: CompanyMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyMemberInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectAvgAggregateOutputType = {
    rdoCount: number | null
    incidentCount: number | null
    photoCount: number | null
  }

  export type ProjectSumAggregateOutputType = {
    rdoCount: number | null
    incidentCount: number | null
    photoCount: number | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    companyId: string | null
    name: string | null
    description: string | null
    address: string | null
    status: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
    rdoCount: number | null
    incidentCount: number | null
    photoCount: number | null
    latitude: string | null
    longitude: string | null
    city: string | null
    state: string | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    companyId: string | null
    name: string | null
    description: string | null
    address: string | null
    status: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
    rdoCount: number | null
    incidentCount: number | null
    photoCount: number | null
    latitude: string | null
    longitude: string | null
    city: string | null
    state: string | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    companyId: number
    name: number
    description: number
    address: number
    status: number
    imageUrl: number
    createdAt: number
    updatedAt: number
    rdoCount: number
    incidentCount: number
    photoCount: number
    latitude: number
    longitude: number
    city: number
    state: number
    _all: number
  }


  export type ProjectAvgAggregateInputType = {
    rdoCount?: true
    incidentCount?: true
    photoCount?: true
  }

  export type ProjectSumAggregateInputType = {
    rdoCount?: true
    incidentCount?: true
    photoCount?: true
  }

  export type ProjectMinAggregateInputType = {
    id?: true
    companyId?: true
    name?: true
    description?: true
    address?: true
    status?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    rdoCount?: true
    incidentCount?: true
    photoCount?: true
    latitude?: true
    longitude?: true
    city?: true
    state?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    companyId?: true
    name?: true
    description?: true
    address?: true
    status?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    rdoCount?: true
    incidentCount?: true
    photoCount?: true
    latitude?: true
    longitude?: true
    city?: true
    state?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    companyId?: true
    name?: true
    description?: true
    address?: true
    status?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    rdoCount?: true
    incidentCount?: true
    photoCount?: true
    latitude?: true
    longitude?: true
    city?: true
    state?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _avg?: ProjectAvgAggregateInputType
    _sum?: ProjectSumAggregateInputType
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    companyId: string
    name: string
    description: string | null
    address: string
    status: string
    imageUrl: string | null
    createdAt: Date
    updatedAt: Date
    rdoCount: number
    incidentCount: number
    photoCount: number
    latitude: string
    longitude: string
    city: string
    state: string
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    status?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rdoCount?: boolean
    incidentCount?: boolean
    photoCount?: boolean
    latitude?: boolean
    longitude?: boolean
    city?: boolean
    state?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    comments?: boolean | Project$commentsArgs<ExtArgs>
    rdos?: boolean | Project$rdosArgs<ExtArgs>
    incidents?: boolean | Project$incidentsArgs<ExtArgs>
    media?: boolean | Project$mediaArgs<ExtArgs>
    owners?: boolean | Project$ownersArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    status?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rdoCount?: boolean
    incidentCount?: boolean
    photoCount?: boolean
    latitude?: boolean
    longitude?: boolean
    city?: boolean
    state?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    status?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rdoCount?: boolean
    incidentCount?: boolean
    photoCount?: boolean
    latitude?: boolean
    longitude?: boolean
    city?: boolean
    state?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    companyId?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    status?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    rdoCount?: boolean
    incidentCount?: boolean
    photoCount?: boolean
    latitude?: boolean
    longitude?: boolean
    city?: boolean
    state?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyId" | "name" | "description" | "address" | "status" | "imageUrl" | "createdAt" | "updatedAt" | "rdoCount" | "incidentCount" | "photoCount" | "latitude" | "longitude" | "city" | "state", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    comments?: boolean | Project$commentsArgs<ExtArgs>
    rdos?: boolean | Project$rdosArgs<ExtArgs>
    incidents?: boolean | Project$incidentsArgs<ExtArgs>
    media?: boolean | Project$mediaArgs<ExtArgs>
    owners?: boolean | Project$ownersArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      comments: Prisma.$CommentPayload<ExtArgs>[]
      rdos: Prisma.$RDOPayload<ExtArgs>[]
      incidents: Prisma.$IncidentPayload<ExtArgs>[]
      media: Prisma.$MediaPayload<ExtArgs>[]
      owners: Prisma.$ProjectOwnerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyId: string
      name: string
      description: string | null
      address: string
      status: string
      imageUrl: string | null
      createdAt: Date
      updatedAt: Date
      rdoCount: number
      incidentCount: number
      photoCount: number
      latitude: string
      longitude: string
      city: string
      state: string
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    comments<T extends Project$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Project$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    rdos<T extends Project$rdosArgs<ExtArgs> = {}>(args?: Subset<T, Project$rdosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    incidents<T extends Project$incidentsArgs<ExtArgs> = {}>(args?: Subset<T, Project$incidentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    media<T extends Project$mediaArgs<ExtArgs> = {}>(args?: Subset<T, Project$mediaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    owners<T extends Project$ownersArgs<ExtArgs> = {}>(args?: Subset<T, Project$ownersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly companyId: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly address: FieldRef<"Project", 'String'>
    readonly status: FieldRef<"Project", 'String'>
    readonly imageUrl: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
    readonly rdoCount: FieldRef<"Project", 'Int'>
    readonly incidentCount: FieldRef<"Project", 'Int'>
    readonly photoCount: FieldRef<"Project", 'Int'>
    readonly latitude: FieldRef<"Project", 'String'>
    readonly longitude: FieldRef<"Project", 'String'>
    readonly city: FieldRef<"Project", 'String'>
    readonly state: FieldRef<"Project", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.comments
   */
  export type Project$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Project.rdos
   */
  export type Project$rdosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    where?: RDOWhereInput
    orderBy?: RDOOrderByWithRelationInput | RDOOrderByWithRelationInput[]
    cursor?: RDOWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RDOScalarFieldEnum | RDOScalarFieldEnum[]
  }

  /**
   * Project.incidents
   */
  export type Project$incidentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    where?: IncidentWhereInput
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[]
    cursor?: IncidentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IncidentScalarFieldEnum | IncidentScalarFieldEnum[]
  }

  /**
   * Project.media
   */
  export type Project$mediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    where?: MediaWhereInput
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    cursor?: MediaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Project.owners
   */
  export type Project$ownersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    where?: ProjectOwnerWhereInput
    orderBy?: ProjectOwnerOrderByWithRelationInput | ProjectOwnerOrderByWithRelationInput[]
    cursor?: ProjectOwnerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectOwnerScalarFieldEnum | ProjectOwnerScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model RDO
   */

  export type AggregateRDO = {
    _count: RDOCountAggregateOutputType | null
    _avg: RDOAvgAggregateOutputType | null
    _sum: RDOSumAggregateOutputType | null
    _min: RDOMinAggregateOutputType | null
    _max: RDOMaxAggregateOutputType | null
  }

  export type RDOAvgAggregateOutputType = {
    rdoNumber: number | null
    commentCount: number | null
  }

  export type RDOSumAggregateOutputType = {
    rdoNumber: number | null
    commentCount: number | null
  }

  export type RDOMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    authorId: string | null
    rdoNumber: number | null
    date: Date | null
    status: string | null
    description: string | null
    equipmentUsed: string | null
    workforce: string | null
    createdAt: Date | null
    updatedAt: Date | null
    commentCount: number | null
  }

  export type RDOMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    authorId: string | null
    rdoNumber: number | null
    date: Date | null
    status: string | null
    description: string | null
    equipmentUsed: string | null
    workforce: string | null
    createdAt: Date | null
    updatedAt: Date | null
    commentCount: number | null
  }

  export type RDOCountAggregateOutputType = {
    id: number
    projectId: number
    authorId: number
    rdoNumber: number
    date: number
    status: number
    description: number
    weatherMorning: number
    weatherAfternoon: number
    weatherNight: number
    equipmentUsed: number
    workforce: number
    createdAt: number
    updatedAt: number
    commentCount: number
    _all: number
  }


  export type RDOAvgAggregateInputType = {
    rdoNumber?: true
    commentCount?: true
  }

  export type RDOSumAggregateInputType = {
    rdoNumber?: true
    commentCount?: true
  }

  export type RDOMinAggregateInputType = {
    id?: true
    projectId?: true
    authorId?: true
    rdoNumber?: true
    date?: true
    status?: true
    description?: true
    equipmentUsed?: true
    workforce?: true
    createdAt?: true
    updatedAt?: true
    commentCount?: true
  }

  export type RDOMaxAggregateInputType = {
    id?: true
    projectId?: true
    authorId?: true
    rdoNumber?: true
    date?: true
    status?: true
    description?: true
    equipmentUsed?: true
    workforce?: true
    createdAt?: true
    updatedAt?: true
    commentCount?: true
  }

  export type RDOCountAggregateInputType = {
    id?: true
    projectId?: true
    authorId?: true
    rdoNumber?: true
    date?: true
    status?: true
    description?: true
    weatherMorning?: true
    weatherAfternoon?: true
    weatherNight?: true
    equipmentUsed?: true
    workforce?: true
    createdAt?: true
    updatedAt?: true
    commentCount?: true
    _all?: true
  }

  export type RDOAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RDO to aggregate.
     */
    where?: RDOWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RDOS to fetch.
     */
    orderBy?: RDOOrderByWithRelationInput | RDOOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RDOWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RDOS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RDOS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RDOS
    **/
    _count?: true | RDOCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RDOAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RDOSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RDOMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RDOMaxAggregateInputType
  }

  export type GetRDOAggregateType<T extends RDOAggregateArgs> = {
        [P in keyof T & keyof AggregateRDO]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRDO[P]>
      : GetScalarType<T[P], AggregateRDO[P]>
  }




  export type RDOGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RDOWhereInput
    orderBy?: RDOOrderByWithAggregationInput | RDOOrderByWithAggregationInput[]
    by: RDOScalarFieldEnum[] | RDOScalarFieldEnum
    having?: RDOScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RDOCountAggregateInputType | true
    _avg?: RDOAvgAggregateInputType
    _sum?: RDOSumAggregateInputType
    _min?: RDOMinAggregateInputType
    _max?: RDOMaxAggregateInputType
  }

  export type RDOGroupByOutputType = {
    id: string
    projectId: string
    authorId: string
    rdoNumber: number
    date: Date
    status: string
    description: string
    weatherMorning: JsonValue
    weatherAfternoon: JsonValue
    weatherNight: JsonValue
    equipmentUsed: string
    workforce: string
    createdAt: Date
    updatedAt: Date
    commentCount: number
    _count: RDOCountAggregateOutputType | null
    _avg: RDOAvgAggregateOutputType | null
    _sum: RDOSumAggregateOutputType | null
    _min: RDOMinAggregateOutputType | null
    _max: RDOMaxAggregateOutputType | null
  }

  type GetRDOGroupByPayload<T extends RDOGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RDOGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RDOGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RDOGroupByOutputType[P]>
            : GetScalarType<T[P], RDOGroupByOutputType[P]>
        }
      >
    >


  export type RDOSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    authorId?: boolean
    rdoNumber?: boolean
    date?: boolean
    status?: boolean
    description?: boolean
    weatherMorning?: boolean
    weatherAfternoon?: boolean
    weatherNight?: boolean
    equipmentUsed?: boolean
    workforce?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commentCount?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    comments?: boolean | RDO$commentsArgs<ExtArgs>
    media?: boolean | RDO$mediaArgs<ExtArgs>
    _count?: boolean | RDOCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rDO"]>

  export type RDOSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    authorId?: boolean
    rdoNumber?: boolean
    date?: boolean
    status?: boolean
    description?: boolean
    weatherMorning?: boolean
    weatherAfternoon?: boolean
    weatherNight?: boolean
    equipmentUsed?: boolean
    workforce?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commentCount?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rDO"]>

  export type RDOSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    authorId?: boolean
    rdoNumber?: boolean
    date?: boolean
    status?: boolean
    description?: boolean
    weatherMorning?: boolean
    weatherAfternoon?: boolean
    weatherNight?: boolean
    equipmentUsed?: boolean
    workforce?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commentCount?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rDO"]>

  export type RDOSelectScalar = {
    id?: boolean
    projectId?: boolean
    authorId?: boolean
    rdoNumber?: boolean
    date?: boolean
    status?: boolean
    description?: boolean
    weatherMorning?: boolean
    weatherAfternoon?: boolean
    weatherNight?: boolean
    equipmentUsed?: boolean
    workforce?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commentCount?: boolean
  }

  export type RDOOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "authorId" | "rdoNumber" | "date" | "status" | "description" | "weatherMorning" | "weatherAfternoon" | "weatherNight" | "equipmentUsed" | "workforce" | "createdAt" | "updatedAt" | "commentCount", ExtArgs["result"]["rDO"]>
  export type RDOInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    comments?: boolean | RDO$commentsArgs<ExtArgs>
    media?: boolean | RDO$mediaArgs<ExtArgs>
    _count?: boolean | RDOCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RDOIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RDOIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RDOPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RDO"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      author: Prisma.$UserPayload<ExtArgs>
      comments: Prisma.$CommentPayload<ExtArgs>[]
      media: Prisma.$MediaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      authorId: string
      rdoNumber: number
      date: Date
      status: string
      description: string
      weatherMorning: Prisma.JsonValue
      weatherAfternoon: Prisma.JsonValue
      weatherNight: Prisma.JsonValue
      equipmentUsed: string
      workforce: string
      createdAt: Date
      updatedAt: Date
      commentCount: number
    }, ExtArgs["result"]["rDO"]>
    composites: {}
  }

  type RDOGetPayload<S extends boolean | null | undefined | RDODefaultArgs> = $Result.GetResult<Prisma.$RDOPayload, S>

  type RDOCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RDOFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RDOCountAggregateInputType | true
    }

  export interface RDODelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RDO'], meta: { name: 'RDO' } }
    /**
     * Find zero or one RDO that matches the filter.
     * @param {RDOFindUniqueArgs} args - Arguments to find a RDO
     * @example
     * // Get one RDO
     * const rDO = await prisma.rDO.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RDOFindUniqueArgs>(args: SelectSubset<T, RDOFindUniqueArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RDO that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RDOFindUniqueOrThrowArgs} args - Arguments to find a RDO
     * @example
     * // Get one RDO
     * const rDO = await prisma.rDO.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RDOFindUniqueOrThrowArgs>(args: SelectSubset<T, RDOFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RDO that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RDOFindFirstArgs} args - Arguments to find a RDO
     * @example
     * // Get one RDO
     * const rDO = await prisma.rDO.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RDOFindFirstArgs>(args?: SelectSubset<T, RDOFindFirstArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RDO that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RDOFindFirstOrThrowArgs} args - Arguments to find a RDO
     * @example
     * // Get one RDO
     * const rDO = await prisma.rDO.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RDOFindFirstOrThrowArgs>(args?: SelectSubset<T, RDOFindFirstOrThrowArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RDOS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RDOFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RDOS
     * const rDOS = await prisma.rDO.findMany()
     * 
     * // Get first 10 RDOS
     * const rDOS = await prisma.rDO.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rDOWithIdOnly = await prisma.rDO.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RDOFindManyArgs>(args?: SelectSubset<T, RDOFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RDO.
     * @param {RDOCreateArgs} args - Arguments to create a RDO.
     * @example
     * // Create one RDO
     * const RDO = await prisma.rDO.create({
     *   data: {
     *     // ... data to create a RDO
     *   }
     * })
     * 
     */
    create<T extends RDOCreateArgs>(args: SelectSubset<T, RDOCreateArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RDOS.
     * @param {RDOCreateManyArgs} args - Arguments to create many RDOS.
     * @example
     * // Create many RDOS
     * const rDO = await prisma.rDO.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RDOCreateManyArgs>(args?: SelectSubset<T, RDOCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RDOS and returns the data saved in the database.
     * @param {RDOCreateManyAndReturnArgs} args - Arguments to create many RDOS.
     * @example
     * // Create many RDOS
     * const rDO = await prisma.rDO.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RDOS and only return the `id`
     * const rDOWithIdOnly = await prisma.rDO.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RDOCreateManyAndReturnArgs>(args?: SelectSubset<T, RDOCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RDO.
     * @param {RDODeleteArgs} args - Arguments to delete one RDO.
     * @example
     * // Delete one RDO
     * const RDO = await prisma.rDO.delete({
     *   where: {
     *     // ... filter to delete one RDO
     *   }
     * })
     * 
     */
    delete<T extends RDODeleteArgs>(args: SelectSubset<T, RDODeleteArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RDO.
     * @param {RDOUpdateArgs} args - Arguments to update one RDO.
     * @example
     * // Update one RDO
     * const rDO = await prisma.rDO.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RDOUpdateArgs>(args: SelectSubset<T, RDOUpdateArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RDOS.
     * @param {RDODeleteManyArgs} args - Arguments to filter RDOS to delete.
     * @example
     * // Delete a few RDOS
     * const { count } = await prisma.rDO.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RDODeleteManyArgs>(args?: SelectSubset<T, RDODeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RDOS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RDOUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RDOS
     * const rDO = await prisma.rDO.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RDOUpdateManyArgs>(args: SelectSubset<T, RDOUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RDOS and returns the data updated in the database.
     * @param {RDOUpdateManyAndReturnArgs} args - Arguments to update many RDOS.
     * @example
     * // Update many RDOS
     * const rDO = await prisma.rDO.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RDOS and only return the `id`
     * const rDOWithIdOnly = await prisma.rDO.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RDOUpdateManyAndReturnArgs>(args: SelectSubset<T, RDOUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RDO.
     * @param {RDOUpsertArgs} args - Arguments to update or create a RDO.
     * @example
     * // Update or create a RDO
     * const rDO = await prisma.rDO.upsert({
     *   create: {
     *     // ... data to create a RDO
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RDO we want to update
     *   }
     * })
     */
    upsert<T extends RDOUpsertArgs>(args: SelectSubset<T, RDOUpsertArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RDOS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RDOCountArgs} args - Arguments to filter RDOS to count.
     * @example
     * // Count the number of RDOS
     * const count = await prisma.rDO.count({
     *   where: {
     *     // ... the filter for the RDOS we want to count
     *   }
     * })
    **/
    count<T extends RDOCountArgs>(
      args?: Subset<T, RDOCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RDOCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RDO.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RDOAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RDOAggregateArgs>(args: Subset<T, RDOAggregateArgs>): Prisma.PrismaPromise<GetRDOAggregateType<T>>

    /**
     * Group by RDO.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RDOGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RDOGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RDOGroupByArgs['orderBy'] }
        : { orderBy?: RDOGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RDOGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRDOGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RDO model
   */
  readonly fields: RDOFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RDO.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RDOClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    comments<T extends RDO$commentsArgs<ExtArgs> = {}>(args?: Subset<T, RDO$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    media<T extends RDO$mediaArgs<ExtArgs> = {}>(args?: Subset<T, RDO$mediaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RDO model
   */
  interface RDOFieldRefs {
    readonly id: FieldRef<"RDO", 'String'>
    readonly projectId: FieldRef<"RDO", 'String'>
    readonly authorId: FieldRef<"RDO", 'String'>
    readonly rdoNumber: FieldRef<"RDO", 'Int'>
    readonly date: FieldRef<"RDO", 'DateTime'>
    readonly status: FieldRef<"RDO", 'String'>
    readonly description: FieldRef<"RDO", 'String'>
    readonly weatherMorning: FieldRef<"RDO", 'Json'>
    readonly weatherAfternoon: FieldRef<"RDO", 'Json'>
    readonly weatherNight: FieldRef<"RDO", 'Json'>
    readonly equipmentUsed: FieldRef<"RDO", 'String'>
    readonly workforce: FieldRef<"RDO", 'String'>
    readonly createdAt: FieldRef<"RDO", 'DateTime'>
    readonly updatedAt: FieldRef<"RDO", 'DateTime'>
    readonly commentCount: FieldRef<"RDO", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * RDO findUnique
   */
  export type RDOFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    /**
     * Filter, which RDO to fetch.
     */
    where: RDOWhereUniqueInput
  }

  /**
   * RDO findUniqueOrThrow
   */
  export type RDOFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    /**
     * Filter, which RDO to fetch.
     */
    where: RDOWhereUniqueInput
  }

  /**
   * RDO findFirst
   */
  export type RDOFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    /**
     * Filter, which RDO to fetch.
     */
    where?: RDOWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RDOS to fetch.
     */
    orderBy?: RDOOrderByWithRelationInput | RDOOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RDOS.
     */
    cursor?: RDOWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RDOS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RDOS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RDOS.
     */
    distinct?: RDOScalarFieldEnum | RDOScalarFieldEnum[]
  }

  /**
   * RDO findFirstOrThrow
   */
  export type RDOFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    /**
     * Filter, which RDO to fetch.
     */
    where?: RDOWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RDOS to fetch.
     */
    orderBy?: RDOOrderByWithRelationInput | RDOOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RDOS.
     */
    cursor?: RDOWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RDOS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RDOS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RDOS.
     */
    distinct?: RDOScalarFieldEnum | RDOScalarFieldEnum[]
  }

  /**
   * RDO findMany
   */
  export type RDOFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    /**
     * Filter, which RDOS to fetch.
     */
    where?: RDOWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RDOS to fetch.
     */
    orderBy?: RDOOrderByWithRelationInput | RDOOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RDOS.
     */
    cursor?: RDOWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RDOS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RDOS.
     */
    skip?: number
    distinct?: RDOScalarFieldEnum | RDOScalarFieldEnum[]
  }

  /**
   * RDO create
   */
  export type RDOCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    /**
     * The data needed to create a RDO.
     */
    data: XOR<RDOCreateInput, RDOUncheckedCreateInput>
  }

  /**
   * RDO createMany
   */
  export type RDOCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RDOS.
     */
    data: RDOCreateManyInput | RDOCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RDO createManyAndReturn
   */
  export type RDOCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * The data used to create many RDOS.
     */
    data: RDOCreateManyInput | RDOCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RDO update
   */
  export type RDOUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    /**
     * The data needed to update a RDO.
     */
    data: XOR<RDOUpdateInput, RDOUncheckedUpdateInput>
    /**
     * Choose, which RDO to update.
     */
    where: RDOWhereUniqueInput
  }

  /**
   * RDO updateMany
   */
  export type RDOUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RDOS.
     */
    data: XOR<RDOUpdateManyMutationInput, RDOUncheckedUpdateManyInput>
    /**
     * Filter which RDOS to update
     */
    where?: RDOWhereInput
    /**
     * Limit how many RDOS to update.
     */
    limit?: number
  }

  /**
   * RDO updateManyAndReturn
   */
  export type RDOUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * The data used to update RDOS.
     */
    data: XOR<RDOUpdateManyMutationInput, RDOUncheckedUpdateManyInput>
    /**
     * Filter which RDOS to update
     */
    where?: RDOWhereInput
    /**
     * Limit how many RDOS to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RDO upsert
   */
  export type RDOUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    /**
     * The filter to search for the RDO to update in case it exists.
     */
    where: RDOWhereUniqueInput
    /**
     * In case the RDO found by the `where` argument doesn't exist, create a new RDO with this data.
     */
    create: XOR<RDOCreateInput, RDOUncheckedCreateInput>
    /**
     * In case the RDO was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RDOUpdateInput, RDOUncheckedUpdateInput>
  }

  /**
   * RDO delete
   */
  export type RDODeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    /**
     * Filter which RDO to delete.
     */
    where: RDOWhereUniqueInput
  }

  /**
   * RDO deleteMany
   */
  export type RDODeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RDOS to delete
     */
    where?: RDOWhereInput
    /**
     * Limit how many RDOS to delete.
     */
    limit?: number
  }

  /**
   * RDO.comments
   */
  export type RDO$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * RDO.media
   */
  export type RDO$mediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    where?: MediaWhereInput
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    cursor?: MediaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * RDO without action
   */
  export type RDODefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
  }


  /**
   * Model Incident
   */

  export type AggregateIncident = {
    _count: IncidentCountAggregateOutputType | null
    _avg: IncidentAvgAggregateOutputType | null
    _sum: IncidentSumAggregateOutputType | null
    _min: IncidentMinAggregateOutputType | null
    _max: IncidentMaxAggregateOutputType | null
  }

  export type IncidentAvgAggregateOutputType = {
    commentCount: number | null
    incidentNumber: number | null
  }

  export type IncidentSumAggregateOutputType = {
    commentCount: number | null
    incidentNumber: number | null
  }

  export type IncidentMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    authorId: string | null
    date: Date | null
    status: string | null
    priority: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    commentCount: number | null
    incidentNumber: number | null
  }

  export type IncidentMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    authorId: string | null
    date: Date | null
    status: string | null
    priority: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    commentCount: number | null
    incidentNumber: number | null
  }

  export type IncidentCountAggregateOutputType = {
    id: number
    projectId: number
    authorId: number
    date: number
    status: number
    priority: number
    description: number
    createdAt: number
    updatedAt: number
    commentCount: number
    incidentNumber: number
    _all: number
  }


  export type IncidentAvgAggregateInputType = {
    commentCount?: true
    incidentNumber?: true
  }

  export type IncidentSumAggregateInputType = {
    commentCount?: true
    incidentNumber?: true
  }

  export type IncidentMinAggregateInputType = {
    id?: true
    projectId?: true
    authorId?: true
    date?: true
    status?: true
    priority?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    commentCount?: true
    incidentNumber?: true
  }

  export type IncidentMaxAggregateInputType = {
    id?: true
    projectId?: true
    authorId?: true
    date?: true
    status?: true
    priority?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    commentCount?: true
    incidentNumber?: true
  }

  export type IncidentCountAggregateInputType = {
    id?: true
    projectId?: true
    authorId?: true
    date?: true
    status?: true
    priority?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    commentCount?: true
    incidentNumber?: true
    _all?: true
  }

  export type IncidentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Incident to aggregate.
     */
    where?: IncidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Incidents to fetch.
     */
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IncidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Incidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Incidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Incidents
    **/
    _count?: true | IncidentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IncidentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IncidentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IncidentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IncidentMaxAggregateInputType
  }

  export type GetIncidentAggregateType<T extends IncidentAggregateArgs> = {
        [P in keyof T & keyof AggregateIncident]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIncident[P]>
      : GetScalarType<T[P], AggregateIncident[P]>
  }




  export type IncidentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IncidentWhereInput
    orderBy?: IncidentOrderByWithAggregationInput | IncidentOrderByWithAggregationInput[]
    by: IncidentScalarFieldEnum[] | IncidentScalarFieldEnum
    having?: IncidentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IncidentCountAggregateInputType | true
    _avg?: IncidentAvgAggregateInputType
    _sum?: IncidentSumAggregateInputType
    _min?: IncidentMinAggregateInputType
    _max?: IncidentMaxAggregateInputType
  }

  export type IncidentGroupByOutputType = {
    id: string
    projectId: string
    authorId: string
    date: Date
    status: string
    priority: string
    description: string
    createdAt: Date
    updatedAt: Date
    commentCount: number
    incidentNumber: number
    _count: IncidentCountAggregateOutputType | null
    _avg: IncidentAvgAggregateOutputType | null
    _sum: IncidentSumAggregateOutputType | null
    _min: IncidentMinAggregateOutputType | null
    _max: IncidentMaxAggregateOutputType | null
  }

  type GetIncidentGroupByPayload<T extends IncidentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IncidentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IncidentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IncidentGroupByOutputType[P]>
            : GetScalarType<T[P], IncidentGroupByOutputType[P]>
        }
      >
    >


  export type IncidentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    authorId?: boolean
    date?: boolean
    status?: boolean
    priority?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commentCount?: boolean
    incidentNumber?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    comments?: boolean | Incident$commentsArgs<ExtArgs>
    media?: boolean | Incident$mediaArgs<ExtArgs>
    _count?: boolean | IncidentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["incident"]>

  export type IncidentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    authorId?: boolean
    date?: boolean
    status?: boolean
    priority?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commentCount?: boolean
    incidentNumber?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["incident"]>

  export type IncidentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    authorId?: boolean
    date?: boolean
    status?: boolean
    priority?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commentCount?: boolean
    incidentNumber?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["incident"]>

  export type IncidentSelectScalar = {
    id?: boolean
    projectId?: boolean
    authorId?: boolean
    date?: boolean
    status?: boolean
    priority?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    commentCount?: boolean
    incidentNumber?: boolean
  }

  export type IncidentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "authorId" | "date" | "status" | "priority" | "description" | "createdAt" | "updatedAt" | "commentCount" | "incidentNumber", ExtArgs["result"]["incident"]>
  export type IncidentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
    comments?: boolean | Incident$commentsArgs<ExtArgs>
    media?: boolean | Incident$mediaArgs<ExtArgs>
    _count?: boolean | IncidentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type IncidentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type IncidentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $IncidentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Incident"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      author: Prisma.$UserPayload<ExtArgs>
      comments: Prisma.$CommentPayload<ExtArgs>[]
      media: Prisma.$MediaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      authorId: string
      date: Date
      status: string
      priority: string
      description: string
      createdAt: Date
      updatedAt: Date
      commentCount: number
      incidentNumber: number
    }, ExtArgs["result"]["incident"]>
    composites: {}
  }

  type IncidentGetPayload<S extends boolean | null | undefined | IncidentDefaultArgs> = $Result.GetResult<Prisma.$IncidentPayload, S>

  type IncidentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IncidentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IncidentCountAggregateInputType | true
    }

  export interface IncidentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Incident'], meta: { name: 'Incident' } }
    /**
     * Find zero or one Incident that matches the filter.
     * @param {IncidentFindUniqueArgs} args - Arguments to find a Incident
     * @example
     * // Get one Incident
     * const incident = await prisma.incident.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IncidentFindUniqueArgs>(args: SelectSubset<T, IncidentFindUniqueArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Incident that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IncidentFindUniqueOrThrowArgs} args - Arguments to find a Incident
     * @example
     * // Get one Incident
     * const incident = await prisma.incident.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IncidentFindUniqueOrThrowArgs>(args: SelectSubset<T, IncidentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Incident that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentFindFirstArgs} args - Arguments to find a Incident
     * @example
     * // Get one Incident
     * const incident = await prisma.incident.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IncidentFindFirstArgs>(args?: SelectSubset<T, IncidentFindFirstArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Incident that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentFindFirstOrThrowArgs} args - Arguments to find a Incident
     * @example
     * // Get one Incident
     * const incident = await prisma.incident.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IncidentFindFirstOrThrowArgs>(args?: SelectSubset<T, IncidentFindFirstOrThrowArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Incidents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Incidents
     * const incidents = await prisma.incident.findMany()
     * 
     * // Get first 10 Incidents
     * const incidents = await prisma.incident.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const incidentWithIdOnly = await prisma.incident.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IncidentFindManyArgs>(args?: SelectSubset<T, IncidentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Incident.
     * @param {IncidentCreateArgs} args - Arguments to create a Incident.
     * @example
     * // Create one Incident
     * const Incident = await prisma.incident.create({
     *   data: {
     *     // ... data to create a Incident
     *   }
     * })
     * 
     */
    create<T extends IncidentCreateArgs>(args: SelectSubset<T, IncidentCreateArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Incidents.
     * @param {IncidentCreateManyArgs} args - Arguments to create many Incidents.
     * @example
     * // Create many Incidents
     * const incident = await prisma.incident.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IncidentCreateManyArgs>(args?: SelectSubset<T, IncidentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Incidents and returns the data saved in the database.
     * @param {IncidentCreateManyAndReturnArgs} args - Arguments to create many Incidents.
     * @example
     * // Create many Incidents
     * const incident = await prisma.incident.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Incidents and only return the `id`
     * const incidentWithIdOnly = await prisma.incident.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IncidentCreateManyAndReturnArgs>(args?: SelectSubset<T, IncidentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Incident.
     * @param {IncidentDeleteArgs} args - Arguments to delete one Incident.
     * @example
     * // Delete one Incident
     * const Incident = await prisma.incident.delete({
     *   where: {
     *     // ... filter to delete one Incident
     *   }
     * })
     * 
     */
    delete<T extends IncidentDeleteArgs>(args: SelectSubset<T, IncidentDeleteArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Incident.
     * @param {IncidentUpdateArgs} args - Arguments to update one Incident.
     * @example
     * // Update one Incident
     * const incident = await prisma.incident.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IncidentUpdateArgs>(args: SelectSubset<T, IncidentUpdateArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Incidents.
     * @param {IncidentDeleteManyArgs} args - Arguments to filter Incidents to delete.
     * @example
     * // Delete a few Incidents
     * const { count } = await prisma.incident.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IncidentDeleteManyArgs>(args?: SelectSubset<T, IncidentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Incidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Incidents
     * const incident = await prisma.incident.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IncidentUpdateManyArgs>(args: SelectSubset<T, IncidentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Incidents and returns the data updated in the database.
     * @param {IncidentUpdateManyAndReturnArgs} args - Arguments to update many Incidents.
     * @example
     * // Update many Incidents
     * const incident = await prisma.incident.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Incidents and only return the `id`
     * const incidentWithIdOnly = await prisma.incident.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IncidentUpdateManyAndReturnArgs>(args: SelectSubset<T, IncidentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Incident.
     * @param {IncidentUpsertArgs} args - Arguments to update or create a Incident.
     * @example
     * // Update or create a Incident
     * const incident = await prisma.incident.upsert({
     *   create: {
     *     // ... data to create a Incident
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Incident we want to update
     *   }
     * })
     */
    upsert<T extends IncidentUpsertArgs>(args: SelectSubset<T, IncidentUpsertArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Incidents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentCountArgs} args - Arguments to filter Incidents to count.
     * @example
     * // Count the number of Incidents
     * const count = await prisma.incident.count({
     *   where: {
     *     // ... the filter for the Incidents we want to count
     *   }
     * })
    **/
    count<T extends IncidentCountArgs>(
      args?: Subset<T, IncidentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IncidentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Incident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IncidentAggregateArgs>(args: Subset<T, IncidentAggregateArgs>): Prisma.PrismaPromise<GetIncidentAggregateType<T>>

    /**
     * Group by Incident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IncidentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IncidentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IncidentGroupByArgs['orderBy'] }
        : { orderBy?: IncidentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IncidentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIncidentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Incident model
   */
  readonly fields: IncidentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Incident.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IncidentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    comments<T extends Incident$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Incident$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    media<T extends Incident$mediaArgs<ExtArgs> = {}>(args?: Subset<T, Incident$mediaArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Incident model
   */
  interface IncidentFieldRefs {
    readonly id: FieldRef<"Incident", 'String'>
    readonly projectId: FieldRef<"Incident", 'String'>
    readonly authorId: FieldRef<"Incident", 'String'>
    readonly date: FieldRef<"Incident", 'DateTime'>
    readonly status: FieldRef<"Incident", 'String'>
    readonly priority: FieldRef<"Incident", 'String'>
    readonly description: FieldRef<"Incident", 'String'>
    readonly createdAt: FieldRef<"Incident", 'DateTime'>
    readonly updatedAt: FieldRef<"Incident", 'DateTime'>
    readonly commentCount: FieldRef<"Incident", 'Int'>
    readonly incidentNumber: FieldRef<"Incident", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Incident findUnique
   */
  export type IncidentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    /**
     * Filter, which Incident to fetch.
     */
    where: IncidentWhereUniqueInput
  }

  /**
   * Incident findUniqueOrThrow
   */
  export type IncidentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    /**
     * Filter, which Incident to fetch.
     */
    where: IncidentWhereUniqueInput
  }

  /**
   * Incident findFirst
   */
  export type IncidentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    /**
     * Filter, which Incident to fetch.
     */
    where?: IncidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Incidents to fetch.
     */
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Incidents.
     */
    cursor?: IncidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Incidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Incidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Incidents.
     */
    distinct?: IncidentScalarFieldEnum | IncidentScalarFieldEnum[]
  }

  /**
   * Incident findFirstOrThrow
   */
  export type IncidentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    /**
     * Filter, which Incident to fetch.
     */
    where?: IncidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Incidents to fetch.
     */
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Incidents.
     */
    cursor?: IncidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Incidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Incidents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Incidents.
     */
    distinct?: IncidentScalarFieldEnum | IncidentScalarFieldEnum[]
  }

  /**
   * Incident findMany
   */
  export type IncidentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    /**
     * Filter, which Incidents to fetch.
     */
    where?: IncidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Incidents to fetch.
     */
    orderBy?: IncidentOrderByWithRelationInput | IncidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Incidents.
     */
    cursor?: IncidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Incidents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Incidents.
     */
    skip?: number
    distinct?: IncidentScalarFieldEnum | IncidentScalarFieldEnum[]
  }

  /**
   * Incident create
   */
  export type IncidentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    /**
     * The data needed to create a Incident.
     */
    data: XOR<IncidentCreateInput, IncidentUncheckedCreateInput>
  }

  /**
   * Incident createMany
   */
  export type IncidentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Incidents.
     */
    data: IncidentCreateManyInput | IncidentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Incident createManyAndReturn
   */
  export type IncidentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * The data used to create many Incidents.
     */
    data: IncidentCreateManyInput | IncidentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Incident update
   */
  export type IncidentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    /**
     * The data needed to update a Incident.
     */
    data: XOR<IncidentUpdateInput, IncidentUncheckedUpdateInput>
    /**
     * Choose, which Incident to update.
     */
    where: IncidentWhereUniqueInput
  }

  /**
   * Incident updateMany
   */
  export type IncidentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Incidents.
     */
    data: XOR<IncidentUpdateManyMutationInput, IncidentUncheckedUpdateManyInput>
    /**
     * Filter which Incidents to update
     */
    where?: IncidentWhereInput
    /**
     * Limit how many Incidents to update.
     */
    limit?: number
  }

  /**
   * Incident updateManyAndReturn
   */
  export type IncidentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * The data used to update Incidents.
     */
    data: XOR<IncidentUpdateManyMutationInput, IncidentUncheckedUpdateManyInput>
    /**
     * Filter which Incidents to update
     */
    where?: IncidentWhereInput
    /**
     * Limit how many Incidents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Incident upsert
   */
  export type IncidentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    /**
     * The filter to search for the Incident to update in case it exists.
     */
    where: IncidentWhereUniqueInput
    /**
     * In case the Incident found by the `where` argument doesn't exist, create a new Incident with this data.
     */
    create: XOR<IncidentCreateInput, IncidentUncheckedCreateInput>
    /**
     * In case the Incident was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IncidentUpdateInput, IncidentUncheckedUpdateInput>
  }

  /**
   * Incident delete
   */
  export type IncidentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    /**
     * Filter which Incident to delete.
     */
    where: IncidentWhereUniqueInput
  }

  /**
   * Incident deleteMany
   */
  export type IncidentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Incidents to delete
     */
    where?: IncidentWhereInput
    /**
     * Limit how many Incidents to delete.
     */
    limit?: number
  }

  /**
   * Incident.comments
   */
  export type Incident$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Incident.media
   */
  export type Incident$mediaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    where?: MediaWhereInput
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    cursor?: MediaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Incident without action
   */
  export type IncidentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
  }


  /**
   * Model Media
   */

  export type AggregateMedia = {
    _count: MediaCountAggregateOutputType | null
    _min: MediaMinAggregateOutputType | null
    _max: MediaMaxAggregateOutputType | null
  }

  export type MediaMinAggregateOutputType = {
    id: string | null
    recordId: string | null
    recordType: string | null
    url: string | null
    type: string | null
    createdAt: Date | null
    projectId: string | null
    companyId: string | null
    rdoId: string | null
    incidentId: string | null
  }

  export type MediaMaxAggregateOutputType = {
    id: string | null
    recordId: string | null
    recordType: string | null
    url: string | null
    type: string | null
    createdAt: Date | null
    projectId: string | null
    companyId: string | null
    rdoId: string | null
    incidentId: string | null
  }

  export type MediaCountAggregateOutputType = {
    id: number
    recordId: number
    recordType: number
    url: number
    type: number
    createdAt: number
    projectId: number
    companyId: number
    rdoId: number
    incidentId: number
    _all: number
  }


  export type MediaMinAggregateInputType = {
    id?: true
    recordId?: true
    recordType?: true
    url?: true
    type?: true
    createdAt?: true
    projectId?: true
    companyId?: true
    rdoId?: true
    incidentId?: true
  }

  export type MediaMaxAggregateInputType = {
    id?: true
    recordId?: true
    recordType?: true
    url?: true
    type?: true
    createdAt?: true
    projectId?: true
    companyId?: true
    rdoId?: true
    incidentId?: true
  }

  export type MediaCountAggregateInputType = {
    id?: true
    recordId?: true
    recordType?: true
    url?: true
    type?: true
    createdAt?: true
    projectId?: true
    companyId?: true
    rdoId?: true
    incidentId?: true
    _all?: true
  }

  export type MediaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Media to aggregate.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Media
    **/
    _count?: true | MediaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MediaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MediaMaxAggregateInputType
  }

  export type GetMediaAggregateType<T extends MediaAggregateArgs> = {
        [P in keyof T & keyof AggregateMedia]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMedia[P]>
      : GetScalarType<T[P], AggregateMedia[P]>
  }




  export type MediaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaWhereInput
    orderBy?: MediaOrderByWithAggregationInput | MediaOrderByWithAggregationInput[]
    by: MediaScalarFieldEnum[] | MediaScalarFieldEnum
    having?: MediaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MediaCountAggregateInputType | true
    _min?: MediaMinAggregateInputType
    _max?: MediaMaxAggregateInputType
  }

  export type MediaGroupByOutputType = {
    id: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt: Date
    projectId: string
    companyId: string
    rdoId: string | null
    incidentId: string | null
    _count: MediaCountAggregateOutputType | null
    _min: MediaMinAggregateOutputType | null
    _max: MediaMaxAggregateOutputType | null
  }

  type GetMediaGroupByPayload<T extends MediaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MediaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MediaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MediaGroupByOutputType[P]>
            : GetScalarType<T[P], MediaGroupByOutputType[P]>
        }
      >
    >


  export type MediaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recordId?: boolean
    recordType?: boolean
    url?: boolean
    type?: boolean
    createdAt?: boolean
    projectId?: boolean
    companyId?: boolean
    rdoId?: boolean
    incidentId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    rdo?: boolean | Media$rdoArgs<ExtArgs>
    incident?: boolean | Media$incidentArgs<ExtArgs>
  }, ExtArgs["result"]["media"]>

  export type MediaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recordId?: boolean
    recordType?: boolean
    url?: boolean
    type?: boolean
    createdAt?: boolean
    projectId?: boolean
    companyId?: boolean
    rdoId?: boolean
    incidentId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    rdo?: boolean | Media$rdoArgs<ExtArgs>
    incident?: boolean | Media$incidentArgs<ExtArgs>
  }, ExtArgs["result"]["media"]>

  export type MediaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recordId?: boolean
    recordType?: boolean
    url?: boolean
    type?: boolean
    createdAt?: boolean
    projectId?: boolean
    companyId?: boolean
    rdoId?: boolean
    incidentId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    rdo?: boolean | Media$rdoArgs<ExtArgs>
    incident?: boolean | Media$incidentArgs<ExtArgs>
  }, ExtArgs["result"]["media"]>

  export type MediaSelectScalar = {
    id?: boolean
    recordId?: boolean
    recordType?: boolean
    url?: boolean
    type?: boolean
    createdAt?: boolean
    projectId?: boolean
    companyId?: boolean
    rdoId?: boolean
    incidentId?: boolean
  }

  export type MediaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "recordId" | "recordType" | "url" | "type" | "createdAt" | "projectId" | "companyId" | "rdoId" | "incidentId", ExtArgs["result"]["media"]>
  export type MediaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    rdo?: boolean | Media$rdoArgs<ExtArgs>
    incident?: boolean | Media$incidentArgs<ExtArgs>
  }
  export type MediaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    rdo?: boolean | Media$rdoArgs<ExtArgs>
    incident?: boolean | Media$incidentArgs<ExtArgs>
  }
  export type MediaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    rdo?: boolean | Media$rdoArgs<ExtArgs>
    incident?: boolean | Media$incidentArgs<ExtArgs>
  }

  export type $MediaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Media"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      company: Prisma.$CompanyPayload<ExtArgs>
      rdo: Prisma.$RDOPayload<ExtArgs> | null
      incident: Prisma.$IncidentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      recordId: string
      recordType: string
      url: string
      type: string
      createdAt: Date
      projectId: string
      companyId: string
      rdoId: string | null
      incidentId: string | null
    }, ExtArgs["result"]["media"]>
    composites: {}
  }

  type MediaGetPayload<S extends boolean | null | undefined | MediaDefaultArgs> = $Result.GetResult<Prisma.$MediaPayload, S>

  type MediaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MediaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MediaCountAggregateInputType | true
    }

  export interface MediaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Media'], meta: { name: 'Media' } }
    /**
     * Find zero or one Media that matches the filter.
     * @param {MediaFindUniqueArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MediaFindUniqueArgs>(args: SelectSubset<T, MediaFindUniqueArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Media that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MediaFindUniqueOrThrowArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MediaFindUniqueOrThrowArgs>(args: SelectSubset<T, MediaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Media that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaFindFirstArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MediaFindFirstArgs>(args?: SelectSubset<T, MediaFindFirstArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Media that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaFindFirstOrThrowArgs} args - Arguments to find a Media
     * @example
     * // Get one Media
     * const media = await prisma.media.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MediaFindFirstOrThrowArgs>(args?: SelectSubset<T, MediaFindFirstOrThrowArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Media that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Media
     * const media = await prisma.media.findMany()
     * 
     * // Get first 10 Media
     * const media = await prisma.media.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mediaWithIdOnly = await prisma.media.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MediaFindManyArgs>(args?: SelectSubset<T, MediaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Media.
     * @param {MediaCreateArgs} args - Arguments to create a Media.
     * @example
     * // Create one Media
     * const Media = await prisma.media.create({
     *   data: {
     *     // ... data to create a Media
     *   }
     * })
     * 
     */
    create<T extends MediaCreateArgs>(args: SelectSubset<T, MediaCreateArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Media.
     * @param {MediaCreateManyArgs} args - Arguments to create many Media.
     * @example
     * // Create many Media
     * const media = await prisma.media.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MediaCreateManyArgs>(args?: SelectSubset<T, MediaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Media and returns the data saved in the database.
     * @param {MediaCreateManyAndReturnArgs} args - Arguments to create many Media.
     * @example
     * // Create many Media
     * const media = await prisma.media.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Media and only return the `id`
     * const mediaWithIdOnly = await prisma.media.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MediaCreateManyAndReturnArgs>(args?: SelectSubset<T, MediaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Media.
     * @param {MediaDeleteArgs} args - Arguments to delete one Media.
     * @example
     * // Delete one Media
     * const Media = await prisma.media.delete({
     *   where: {
     *     // ... filter to delete one Media
     *   }
     * })
     * 
     */
    delete<T extends MediaDeleteArgs>(args: SelectSubset<T, MediaDeleteArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Media.
     * @param {MediaUpdateArgs} args - Arguments to update one Media.
     * @example
     * // Update one Media
     * const media = await prisma.media.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MediaUpdateArgs>(args: SelectSubset<T, MediaUpdateArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Media.
     * @param {MediaDeleteManyArgs} args - Arguments to filter Media to delete.
     * @example
     * // Delete a few Media
     * const { count } = await prisma.media.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MediaDeleteManyArgs>(args?: SelectSubset<T, MediaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Media
     * const media = await prisma.media.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MediaUpdateManyArgs>(args: SelectSubset<T, MediaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Media and returns the data updated in the database.
     * @param {MediaUpdateManyAndReturnArgs} args - Arguments to update many Media.
     * @example
     * // Update many Media
     * const media = await prisma.media.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Media and only return the `id`
     * const mediaWithIdOnly = await prisma.media.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MediaUpdateManyAndReturnArgs>(args: SelectSubset<T, MediaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Media.
     * @param {MediaUpsertArgs} args - Arguments to update or create a Media.
     * @example
     * // Update or create a Media
     * const media = await prisma.media.upsert({
     *   create: {
     *     // ... data to create a Media
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Media we want to update
     *   }
     * })
     */
    upsert<T extends MediaUpsertArgs>(args: SelectSubset<T, MediaUpsertArgs<ExtArgs>>): Prisma__MediaClient<$Result.GetResult<Prisma.$MediaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaCountArgs} args - Arguments to filter Media to count.
     * @example
     * // Count the number of Media
     * const count = await prisma.media.count({
     *   where: {
     *     // ... the filter for the Media we want to count
     *   }
     * })
    **/
    count<T extends MediaCountArgs>(
      args?: Subset<T, MediaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MediaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MediaAggregateArgs>(args: Subset<T, MediaAggregateArgs>): Prisma.PrismaPromise<GetMediaAggregateType<T>>

    /**
     * Group by Media.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MediaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MediaGroupByArgs['orderBy'] }
        : { orderBy?: MediaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MediaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMediaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Media model
   */
  readonly fields: MediaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Media.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MediaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    rdo<T extends Media$rdoArgs<ExtArgs> = {}>(args?: Subset<T, Media$rdoArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    incident<T extends Media$incidentArgs<ExtArgs> = {}>(args?: Subset<T, Media$incidentArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Media model
   */
  interface MediaFieldRefs {
    readonly id: FieldRef<"Media", 'String'>
    readonly recordId: FieldRef<"Media", 'String'>
    readonly recordType: FieldRef<"Media", 'String'>
    readonly url: FieldRef<"Media", 'String'>
    readonly type: FieldRef<"Media", 'String'>
    readonly createdAt: FieldRef<"Media", 'DateTime'>
    readonly projectId: FieldRef<"Media", 'String'>
    readonly companyId: FieldRef<"Media", 'String'>
    readonly rdoId: FieldRef<"Media", 'String'>
    readonly incidentId: FieldRef<"Media", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Media findUnique
   */
  export type MediaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media findUniqueOrThrow
   */
  export type MediaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media findFirst
   */
  export type MediaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Media.
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Media.
     */
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Media findFirstOrThrow
   */
  export type MediaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Media.
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Media.
     */
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Media findMany
   */
  export type MediaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter, which Media to fetch.
     */
    where?: MediaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Media to fetch.
     */
    orderBy?: MediaOrderByWithRelationInput | MediaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Media.
     */
    cursor?: MediaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Media from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Media.
     */
    skip?: number
    distinct?: MediaScalarFieldEnum | MediaScalarFieldEnum[]
  }

  /**
   * Media create
   */
  export type MediaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * The data needed to create a Media.
     */
    data: XOR<MediaCreateInput, MediaUncheckedCreateInput>
  }

  /**
   * Media createMany
   */
  export type MediaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Media.
     */
    data: MediaCreateManyInput | MediaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Media createManyAndReturn
   */
  export type MediaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * The data used to create many Media.
     */
    data: MediaCreateManyInput | MediaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Media update
   */
  export type MediaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * The data needed to update a Media.
     */
    data: XOR<MediaUpdateInput, MediaUncheckedUpdateInput>
    /**
     * Choose, which Media to update.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media updateMany
   */
  export type MediaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Media.
     */
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyInput>
    /**
     * Filter which Media to update
     */
    where?: MediaWhereInput
    /**
     * Limit how many Media to update.
     */
    limit?: number
  }

  /**
   * Media updateManyAndReturn
   */
  export type MediaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * The data used to update Media.
     */
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyInput>
    /**
     * Filter which Media to update
     */
    where?: MediaWhereInput
    /**
     * Limit how many Media to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Media upsert
   */
  export type MediaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * The filter to search for the Media to update in case it exists.
     */
    where: MediaWhereUniqueInput
    /**
     * In case the Media found by the `where` argument doesn't exist, create a new Media with this data.
     */
    create: XOR<MediaCreateInput, MediaUncheckedCreateInput>
    /**
     * In case the Media was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MediaUpdateInput, MediaUncheckedUpdateInput>
  }

  /**
   * Media delete
   */
  export type MediaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
    /**
     * Filter which Media to delete.
     */
    where: MediaWhereUniqueInput
  }

  /**
   * Media deleteMany
   */
  export type MediaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Media to delete
     */
    where?: MediaWhereInput
    /**
     * Limit how many Media to delete.
     */
    limit?: number
  }

  /**
   * Media.rdo
   */
  export type Media$rdoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    where?: RDOWhereInput
  }

  /**
   * Media.incident
   */
  export type Media$incidentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    where?: IncidentWhereInput
  }

  /**
   * Media without action
   */
  export type MediaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Media
     */
    select?: MediaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Media
     */
    omit?: MediaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MediaInclude<ExtArgs> | null
  }


  /**
   * Model ProjectOwner
   */

  export type AggregateProjectOwner = {
    _count: ProjectOwnerCountAggregateOutputType | null
    _min: ProjectOwnerMinAggregateOutputType | null
    _max: ProjectOwnerMaxAggregateOutputType | null
  }

  export type ProjectOwnerMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
    status: string | null
    userId: string | null
  }

  export type ProjectOwnerMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    name: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
    status: string | null
    userId: string | null
  }

  export type ProjectOwnerCountAggregateOutputType = {
    id: number
    projectId: number
    name: number
    email: number
    phone: number
    createdAt: number
    status: number
    userId: number
    _all: number
  }


  export type ProjectOwnerMinAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    email?: true
    phone?: true
    createdAt?: true
    status?: true
    userId?: true
  }

  export type ProjectOwnerMaxAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    email?: true
    phone?: true
    createdAt?: true
    status?: true
    userId?: true
  }

  export type ProjectOwnerCountAggregateInputType = {
    id?: true
    projectId?: true
    name?: true
    email?: true
    phone?: true
    createdAt?: true
    status?: true
    userId?: true
    _all?: true
  }

  export type ProjectOwnerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectOwner to aggregate.
     */
    where?: ProjectOwnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectOwners to fetch.
     */
    orderBy?: ProjectOwnerOrderByWithRelationInput | ProjectOwnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectOwnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectOwners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectOwners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectOwners
    **/
    _count?: true | ProjectOwnerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectOwnerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectOwnerMaxAggregateInputType
  }

  export type GetProjectOwnerAggregateType<T extends ProjectOwnerAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectOwner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectOwner[P]>
      : GetScalarType<T[P], AggregateProjectOwner[P]>
  }




  export type ProjectOwnerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectOwnerWhereInput
    orderBy?: ProjectOwnerOrderByWithAggregationInput | ProjectOwnerOrderByWithAggregationInput[]
    by: ProjectOwnerScalarFieldEnum[] | ProjectOwnerScalarFieldEnum
    having?: ProjectOwnerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectOwnerCountAggregateInputType | true
    _min?: ProjectOwnerMinAggregateInputType
    _max?: ProjectOwnerMaxAggregateInputType
  }

  export type ProjectOwnerGroupByOutputType = {
    id: string
    projectId: string
    name: string
    email: string
    phone: string
    createdAt: Date
    status: string
    userId: string | null
    _count: ProjectOwnerCountAggregateOutputType | null
    _min: ProjectOwnerMinAggregateOutputType | null
    _max: ProjectOwnerMaxAggregateOutputType | null
  }

  type GetProjectOwnerGroupByPayload<T extends ProjectOwnerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectOwnerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectOwnerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectOwnerGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectOwnerGroupByOutputType[P]>
        }
      >
    >


  export type ProjectOwnerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    status?: boolean
    userId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | ProjectOwner$userArgs<ExtArgs>
  }, ExtArgs["result"]["projectOwner"]>

  export type ProjectOwnerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    status?: boolean
    userId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | ProjectOwner$userArgs<ExtArgs>
  }, ExtArgs["result"]["projectOwner"]>

  export type ProjectOwnerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    status?: boolean
    userId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | ProjectOwner$userArgs<ExtArgs>
  }, ExtArgs["result"]["projectOwner"]>

  export type ProjectOwnerSelectScalar = {
    id?: boolean
    projectId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    status?: boolean
    userId?: boolean
  }

  export type ProjectOwnerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "name" | "email" | "phone" | "createdAt" | "status" | "userId", ExtArgs["result"]["projectOwner"]>
  export type ProjectOwnerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | ProjectOwner$userArgs<ExtArgs>
  }
  export type ProjectOwnerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | ProjectOwner$userArgs<ExtArgs>
  }
  export type ProjectOwnerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | ProjectOwner$userArgs<ExtArgs>
  }

  export type $ProjectOwnerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectOwner"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      name: string
      email: string
      phone: string
      createdAt: Date
      status: string
      userId: string | null
    }, ExtArgs["result"]["projectOwner"]>
    composites: {}
  }

  type ProjectOwnerGetPayload<S extends boolean | null | undefined | ProjectOwnerDefaultArgs> = $Result.GetResult<Prisma.$ProjectOwnerPayload, S>

  type ProjectOwnerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectOwnerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectOwnerCountAggregateInputType | true
    }

  export interface ProjectOwnerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectOwner'], meta: { name: 'ProjectOwner' } }
    /**
     * Find zero or one ProjectOwner that matches the filter.
     * @param {ProjectOwnerFindUniqueArgs} args - Arguments to find a ProjectOwner
     * @example
     * // Get one ProjectOwner
     * const projectOwner = await prisma.projectOwner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectOwnerFindUniqueArgs>(args: SelectSubset<T, ProjectOwnerFindUniqueArgs<ExtArgs>>): Prisma__ProjectOwnerClient<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectOwner that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectOwnerFindUniqueOrThrowArgs} args - Arguments to find a ProjectOwner
     * @example
     * // Get one ProjectOwner
     * const projectOwner = await prisma.projectOwner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectOwnerFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectOwnerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectOwnerClient<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectOwner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectOwnerFindFirstArgs} args - Arguments to find a ProjectOwner
     * @example
     * // Get one ProjectOwner
     * const projectOwner = await prisma.projectOwner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectOwnerFindFirstArgs>(args?: SelectSubset<T, ProjectOwnerFindFirstArgs<ExtArgs>>): Prisma__ProjectOwnerClient<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectOwner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectOwnerFindFirstOrThrowArgs} args - Arguments to find a ProjectOwner
     * @example
     * // Get one ProjectOwner
     * const projectOwner = await prisma.projectOwner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectOwnerFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectOwnerFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectOwnerClient<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectOwners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectOwnerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectOwners
     * const projectOwners = await prisma.projectOwner.findMany()
     * 
     * // Get first 10 ProjectOwners
     * const projectOwners = await prisma.projectOwner.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectOwnerWithIdOnly = await prisma.projectOwner.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectOwnerFindManyArgs>(args?: SelectSubset<T, ProjectOwnerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectOwner.
     * @param {ProjectOwnerCreateArgs} args - Arguments to create a ProjectOwner.
     * @example
     * // Create one ProjectOwner
     * const ProjectOwner = await prisma.projectOwner.create({
     *   data: {
     *     // ... data to create a ProjectOwner
     *   }
     * })
     * 
     */
    create<T extends ProjectOwnerCreateArgs>(args: SelectSubset<T, ProjectOwnerCreateArgs<ExtArgs>>): Prisma__ProjectOwnerClient<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectOwners.
     * @param {ProjectOwnerCreateManyArgs} args - Arguments to create many ProjectOwners.
     * @example
     * // Create many ProjectOwners
     * const projectOwner = await prisma.projectOwner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectOwnerCreateManyArgs>(args?: SelectSubset<T, ProjectOwnerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectOwners and returns the data saved in the database.
     * @param {ProjectOwnerCreateManyAndReturnArgs} args - Arguments to create many ProjectOwners.
     * @example
     * // Create many ProjectOwners
     * const projectOwner = await prisma.projectOwner.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectOwners and only return the `id`
     * const projectOwnerWithIdOnly = await prisma.projectOwner.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectOwnerCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectOwnerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectOwner.
     * @param {ProjectOwnerDeleteArgs} args - Arguments to delete one ProjectOwner.
     * @example
     * // Delete one ProjectOwner
     * const ProjectOwner = await prisma.projectOwner.delete({
     *   where: {
     *     // ... filter to delete one ProjectOwner
     *   }
     * })
     * 
     */
    delete<T extends ProjectOwnerDeleteArgs>(args: SelectSubset<T, ProjectOwnerDeleteArgs<ExtArgs>>): Prisma__ProjectOwnerClient<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectOwner.
     * @param {ProjectOwnerUpdateArgs} args - Arguments to update one ProjectOwner.
     * @example
     * // Update one ProjectOwner
     * const projectOwner = await prisma.projectOwner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectOwnerUpdateArgs>(args: SelectSubset<T, ProjectOwnerUpdateArgs<ExtArgs>>): Prisma__ProjectOwnerClient<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectOwners.
     * @param {ProjectOwnerDeleteManyArgs} args - Arguments to filter ProjectOwners to delete.
     * @example
     * // Delete a few ProjectOwners
     * const { count } = await prisma.projectOwner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectOwnerDeleteManyArgs>(args?: SelectSubset<T, ProjectOwnerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectOwners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectOwnerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectOwners
     * const projectOwner = await prisma.projectOwner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectOwnerUpdateManyArgs>(args: SelectSubset<T, ProjectOwnerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectOwners and returns the data updated in the database.
     * @param {ProjectOwnerUpdateManyAndReturnArgs} args - Arguments to update many ProjectOwners.
     * @example
     * // Update many ProjectOwners
     * const projectOwner = await prisma.projectOwner.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectOwners and only return the `id`
     * const projectOwnerWithIdOnly = await prisma.projectOwner.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectOwnerUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectOwnerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectOwner.
     * @param {ProjectOwnerUpsertArgs} args - Arguments to update or create a ProjectOwner.
     * @example
     * // Update or create a ProjectOwner
     * const projectOwner = await prisma.projectOwner.upsert({
     *   create: {
     *     // ... data to create a ProjectOwner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectOwner we want to update
     *   }
     * })
     */
    upsert<T extends ProjectOwnerUpsertArgs>(args: SelectSubset<T, ProjectOwnerUpsertArgs<ExtArgs>>): Prisma__ProjectOwnerClient<$Result.GetResult<Prisma.$ProjectOwnerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectOwners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectOwnerCountArgs} args - Arguments to filter ProjectOwners to count.
     * @example
     * // Count the number of ProjectOwners
     * const count = await prisma.projectOwner.count({
     *   where: {
     *     // ... the filter for the ProjectOwners we want to count
     *   }
     * })
    **/
    count<T extends ProjectOwnerCountArgs>(
      args?: Subset<T, ProjectOwnerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectOwnerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectOwner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectOwnerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectOwnerAggregateArgs>(args: Subset<T, ProjectOwnerAggregateArgs>): Prisma.PrismaPromise<GetProjectOwnerAggregateType<T>>

    /**
     * Group by ProjectOwner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectOwnerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectOwnerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectOwnerGroupByArgs['orderBy'] }
        : { orderBy?: ProjectOwnerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectOwnerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectOwnerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectOwner model
   */
  readonly fields: ProjectOwnerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectOwner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectOwnerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends ProjectOwner$userArgs<ExtArgs> = {}>(args?: Subset<T, ProjectOwner$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectOwner model
   */
  interface ProjectOwnerFieldRefs {
    readonly id: FieldRef<"ProjectOwner", 'String'>
    readonly projectId: FieldRef<"ProjectOwner", 'String'>
    readonly name: FieldRef<"ProjectOwner", 'String'>
    readonly email: FieldRef<"ProjectOwner", 'String'>
    readonly phone: FieldRef<"ProjectOwner", 'String'>
    readonly createdAt: FieldRef<"ProjectOwner", 'DateTime'>
    readonly status: FieldRef<"ProjectOwner", 'String'>
    readonly userId: FieldRef<"ProjectOwner", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProjectOwner findUnique
   */
  export type ProjectOwnerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectOwner to fetch.
     */
    where: ProjectOwnerWhereUniqueInput
  }

  /**
   * ProjectOwner findUniqueOrThrow
   */
  export type ProjectOwnerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectOwner to fetch.
     */
    where: ProjectOwnerWhereUniqueInput
  }

  /**
   * ProjectOwner findFirst
   */
  export type ProjectOwnerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectOwner to fetch.
     */
    where?: ProjectOwnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectOwners to fetch.
     */
    orderBy?: ProjectOwnerOrderByWithRelationInput | ProjectOwnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectOwners.
     */
    cursor?: ProjectOwnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectOwners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectOwners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectOwners.
     */
    distinct?: ProjectOwnerScalarFieldEnum | ProjectOwnerScalarFieldEnum[]
  }

  /**
   * ProjectOwner findFirstOrThrow
   */
  export type ProjectOwnerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectOwner to fetch.
     */
    where?: ProjectOwnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectOwners to fetch.
     */
    orderBy?: ProjectOwnerOrderByWithRelationInput | ProjectOwnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectOwners.
     */
    cursor?: ProjectOwnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectOwners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectOwners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectOwners.
     */
    distinct?: ProjectOwnerScalarFieldEnum | ProjectOwnerScalarFieldEnum[]
  }

  /**
   * ProjectOwner findMany
   */
  export type ProjectOwnerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectOwners to fetch.
     */
    where?: ProjectOwnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectOwners to fetch.
     */
    orderBy?: ProjectOwnerOrderByWithRelationInput | ProjectOwnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectOwners.
     */
    cursor?: ProjectOwnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectOwners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectOwners.
     */
    skip?: number
    distinct?: ProjectOwnerScalarFieldEnum | ProjectOwnerScalarFieldEnum[]
  }

  /**
   * ProjectOwner create
   */
  export type ProjectOwnerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectOwner.
     */
    data: XOR<ProjectOwnerCreateInput, ProjectOwnerUncheckedCreateInput>
  }

  /**
   * ProjectOwner createMany
   */
  export type ProjectOwnerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectOwners.
     */
    data: ProjectOwnerCreateManyInput | ProjectOwnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectOwner createManyAndReturn
   */
  export type ProjectOwnerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectOwners.
     */
    data: ProjectOwnerCreateManyInput | ProjectOwnerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectOwner update
   */
  export type ProjectOwnerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectOwner.
     */
    data: XOR<ProjectOwnerUpdateInput, ProjectOwnerUncheckedUpdateInput>
    /**
     * Choose, which ProjectOwner to update.
     */
    where: ProjectOwnerWhereUniqueInput
  }

  /**
   * ProjectOwner updateMany
   */
  export type ProjectOwnerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectOwners.
     */
    data: XOR<ProjectOwnerUpdateManyMutationInput, ProjectOwnerUncheckedUpdateManyInput>
    /**
     * Filter which ProjectOwners to update
     */
    where?: ProjectOwnerWhereInput
    /**
     * Limit how many ProjectOwners to update.
     */
    limit?: number
  }

  /**
   * ProjectOwner updateManyAndReturn
   */
  export type ProjectOwnerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * The data used to update ProjectOwners.
     */
    data: XOR<ProjectOwnerUpdateManyMutationInput, ProjectOwnerUncheckedUpdateManyInput>
    /**
     * Filter which ProjectOwners to update
     */
    where?: ProjectOwnerWhereInput
    /**
     * Limit how many ProjectOwners to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectOwner upsert
   */
  export type ProjectOwnerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectOwner to update in case it exists.
     */
    where: ProjectOwnerWhereUniqueInput
    /**
     * In case the ProjectOwner found by the `where` argument doesn't exist, create a new ProjectOwner with this data.
     */
    create: XOR<ProjectOwnerCreateInput, ProjectOwnerUncheckedCreateInput>
    /**
     * In case the ProjectOwner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectOwnerUpdateInput, ProjectOwnerUncheckedUpdateInput>
  }

  /**
   * ProjectOwner delete
   */
  export type ProjectOwnerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
    /**
     * Filter which ProjectOwner to delete.
     */
    where: ProjectOwnerWhereUniqueInput
  }

  /**
   * ProjectOwner deleteMany
   */
  export type ProjectOwnerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectOwners to delete
     */
    where?: ProjectOwnerWhereInput
    /**
     * Limit how many ProjectOwners to delete.
     */
    limit?: number
  }

  /**
   * ProjectOwner.user
   */
  export type ProjectOwner$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ProjectOwner without action
   */
  export type ProjectOwnerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectOwner
     */
    select?: ProjectOwnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectOwner
     */
    omit?: ProjectOwnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectOwnerInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentMinAggregateOutputType = {
    id: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    projectId: string | null
    rdoId: string | null
    incidentId: string | null
  }

  export type CommentMaxAggregateOutputType = {
    id: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    projectId: string | null
    rdoId: string | null
    incidentId: string | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    content: number
    createdAt: number
    updatedAt: number
    userId: number
    projectId: number
    rdoId: number
    incidentId: number
    _all: number
  }


  export type CommentMinAggregateInputType = {
    id?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    projectId?: true
    rdoId?: true
    incidentId?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    projectId?: true
    rdoId?: true
    incidentId?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    projectId?: true
    rdoId?: true
    incidentId?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: string
    content: string
    createdAt: Date
    updatedAt: Date
    userId: string
    projectId: string | null
    rdoId: string | null
    incidentId: string | null
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    projectId?: boolean
    rdoId?: boolean
    incidentId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | Comment$projectArgs<ExtArgs>
    rdo?: boolean | Comment$rdoArgs<ExtArgs>
    incident?: boolean | Comment$incidentArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    projectId?: boolean
    rdoId?: boolean
    incidentId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | Comment$projectArgs<ExtArgs>
    rdo?: boolean | Comment$rdoArgs<ExtArgs>
    incident?: boolean | Comment$incidentArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    projectId?: boolean
    rdoId?: boolean
    incidentId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | Comment$projectArgs<ExtArgs>
    rdo?: boolean | Comment$rdoArgs<ExtArgs>
    incident?: boolean | Comment$incidentArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    projectId?: boolean
    rdoId?: boolean
    incidentId?: boolean
  }

  export type CommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "createdAt" | "updatedAt" | "userId" | "projectId" | "rdoId" | "incidentId", ExtArgs["result"]["comment"]>
  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | Comment$projectArgs<ExtArgs>
    rdo?: boolean | Comment$rdoArgs<ExtArgs>
    incident?: boolean | Comment$incidentArgs<ExtArgs>
  }
  export type CommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | Comment$projectArgs<ExtArgs>
    rdo?: boolean | Comment$rdoArgs<ExtArgs>
    incident?: boolean | Comment$incidentArgs<ExtArgs>
  }
  export type CommentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    project?: boolean | Comment$projectArgs<ExtArgs>
    rdo?: boolean | Comment$rdoArgs<ExtArgs>
    incident?: boolean | Comment$incidentArgs<ExtArgs>
  }

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      project: Prisma.$ProjectPayload<ExtArgs> | null
      rdo: Prisma.$RDOPayload<ExtArgs> | null
      incident: Prisma.$IncidentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      createdAt: Date
      updatedAt: Date
      userId: string
      projectId: string | null
      rdoId: string | null
      incidentId: string | null
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments and returns the data updated in the database.
     * @param {CommentUpdateManyAndReturnArgs} args - Arguments to update many Comments.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(args: SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    project<T extends Comment$projectArgs<ExtArgs> = {}>(args?: Subset<T, Comment$projectArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    rdo<T extends Comment$rdoArgs<ExtArgs> = {}>(args?: Subset<T, Comment$rdoArgs<ExtArgs>>): Prisma__RDOClient<$Result.GetResult<Prisma.$RDOPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    incident<T extends Comment$incidentArgs<ExtArgs> = {}>(args?: Subset<T, Comment$incidentArgs<ExtArgs>>): Prisma__IncidentClient<$Result.GetResult<Prisma.$IncidentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'String'>
    readonly content: FieldRef<"Comment", 'String'>
    readonly createdAt: FieldRef<"Comment", 'DateTime'>
    readonly updatedAt: FieldRef<"Comment", 'DateTime'>
    readonly userId: FieldRef<"Comment", 'String'>
    readonly projectId: FieldRef<"Comment", 'String'>
    readonly rdoId: FieldRef<"Comment", 'String'>
    readonly incidentId: FieldRef<"Comment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
  }

  /**
   * Comment updateManyAndReturn
   */
  export type CommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to delete.
     */
    limit?: number
  }

  /**
   * Comment.project
   */
  export type Comment$projectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
  }

  /**
   * Comment.rdo
   */
  export type Comment$rdoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RDO
     */
    select?: RDOSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RDO
     */
    omit?: RDOOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RDOInclude<ExtArgs> | null
    where?: RDOWhereInput
  }

  /**
   * Comment.incident
   */
  export type Comment$incidentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Incident
     */
    select?: IncidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Incident
     */
    omit?: IncidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IncidentInclude<ExtArgs> | null
    where?: IncidentWhereInput
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    clerkId: 'clerkId',
    email: 'email',
    phone: 'phone',
    firstName: 'firstName',
    lastName: 'lastName',
    avatar: 'avatar',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    companyId: 'companyId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CompanyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    document: 'document',
    documentType: 'documentType',
    address: 'address',
    city: 'city',
    state: 'state',
    zipCode: 'zipCode',
    logoUrl: 'logoUrl',
    coverUrl: 'coverUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const CompanyMemberScalarFieldEnum: {
    id: 'id',
    companyId: 'companyId',
    userId: 'userId',
    role: 'role',
    isAdmin: 'isAdmin',
    canPost: 'canPost',
    createdAt: 'createdAt'
  };

  export type CompanyMemberScalarFieldEnum = (typeof CompanyMemberScalarFieldEnum)[keyof typeof CompanyMemberScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    companyId: 'companyId',
    name: 'name',
    description: 'description',
    address: 'address',
    status: 'status',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    rdoCount: 'rdoCount',
    incidentCount: 'incidentCount',
    photoCount: 'photoCount',
    latitude: 'latitude',
    longitude: 'longitude',
    city: 'city',
    state: 'state'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const RDOScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    authorId: 'authorId',
    rdoNumber: 'rdoNumber',
    date: 'date',
    status: 'status',
    description: 'description',
    weatherMorning: 'weatherMorning',
    weatherAfternoon: 'weatherAfternoon',
    weatherNight: 'weatherNight',
    equipmentUsed: 'equipmentUsed',
    workforce: 'workforce',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    commentCount: 'commentCount'
  };

  export type RDOScalarFieldEnum = (typeof RDOScalarFieldEnum)[keyof typeof RDOScalarFieldEnum]


  export const IncidentScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    authorId: 'authorId',
    date: 'date',
    status: 'status',
    priority: 'priority',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    commentCount: 'commentCount',
    incidentNumber: 'incidentNumber'
  };

  export type IncidentScalarFieldEnum = (typeof IncidentScalarFieldEnum)[keyof typeof IncidentScalarFieldEnum]


  export const MediaScalarFieldEnum: {
    id: 'id',
    recordId: 'recordId',
    recordType: 'recordType',
    url: 'url',
    type: 'type',
    createdAt: 'createdAt',
    projectId: 'projectId',
    companyId: 'companyId',
    rdoId: 'rdoId',
    incidentId: 'incidentId'
  };

  export type MediaScalarFieldEnum = (typeof MediaScalarFieldEnum)[keyof typeof MediaScalarFieldEnum]


  export const ProjectOwnerScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    email: 'email',
    phone: 'phone',
    createdAt: 'createdAt',
    status: 'status',
    userId: 'userId'
  };

  export type ProjectOwnerScalarFieldEnum = (typeof ProjectOwnerScalarFieldEnum)[keyof typeof ProjectOwnerScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    projectId: 'projectId',
    rdoId: 'rdoId',
    incidentId: 'incidentId'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    clerkId?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    companyId?: StringNullableFilter<"User"> | string | null
    comments?: CommentListRelationFilter
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    companyMemberships?: CompanyMemberListRelationFilter
    rdos?: RDOListRelationFilter
    incidents?: IncidentListRelationFilter
    projectOwners?: ProjectOwnerListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    companyId?: SortOrderInput | SortOrder
    comments?: CommentOrderByRelationAggregateInput
    company?: CompanyOrderByWithRelationInput
    companyMemberships?: CompanyMemberOrderByRelationAggregateInput
    rdos?: RDOOrderByRelationAggregateInput
    incidents?: IncidentOrderByRelationAggregateInput
    projectOwners?: ProjectOwnerOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clerkId?: string
    email?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    companyId?: StringNullableFilter<"User"> | string | null
    comments?: CommentListRelationFilter
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    companyMemberships?: CompanyMemberListRelationFilter
    rdos?: RDOListRelationFilter
    incidents?: IncidentListRelationFilter
    projectOwners?: ProjectOwnerListRelationFilter
  }, "id" | "clerkId" | "email" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    companyId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    clerkId?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    companyId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    id?: StringFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    document?: StringFilter<"Company"> | string
    documentType?: StringFilter<"Company"> | string
    address?: StringFilter<"Company"> | string
    city?: StringFilter<"Company"> | string
    state?: StringFilter<"Company"> | string
    zipCode?: StringFilter<"Company"> | string
    logoUrl?: StringNullableFilter<"Company"> | string | null
    coverUrl?: StringNullableFilter<"Company"> | string | null
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    users?: UserListRelationFilter
    projects?: ProjectListRelationFilter
    members?: CompanyMemberListRelationFilter
    media?: MediaListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    document?: SortOrder
    documentType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    coverUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    projects?: ProjectOrderByRelationAggregateInput
    members?: CompanyMemberOrderByRelationAggregateInput
    media?: MediaOrderByRelationAggregateInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    name?: StringFilter<"Company"> | string
    document?: StringFilter<"Company"> | string
    documentType?: StringFilter<"Company"> | string
    address?: StringFilter<"Company"> | string
    city?: StringFilter<"Company"> | string
    state?: StringFilter<"Company"> | string
    zipCode?: StringFilter<"Company"> | string
    logoUrl?: StringNullableFilter<"Company"> | string | null
    coverUrl?: StringNullableFilter<"Company"> | string | null
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    users?: UserListRelationFilter
    projects?: ProjectListRelationFilter
    members?: CompanyMemberListRelationFilter
    media?: MediaListRelationFilter
  }, "id">

  export type CompanyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    document?: SortOrder
    documentType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    coverUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Company"> | string
    name?: StringWithAggregatesFilter<"Company"> | string
    document?: StringWithAggregatesFilter<"Company"> | string
    documentType?: StringWithAggregatesFilter<"Company"> | string
    address?: StringWithAggregatesFilter<"Company"> | string
    city?: StringWithAggregatesFilter<"Company"> | string
    state?: StringWithAggregatesFilter<"Company"> | string
    zipCode?: StringWithAggregatesFilter<"Company"> | string
    logoUrl?: StringNullableWithAggregatesFilter<"Company"> | string | null
    coverUrl?: StringNullableWithAggregatesFilter<"Company"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
  }

  export type CompanyMemberWhereInput = {
    AND?: CompanyMemberWhereInput | CompanyMemberWhereInput[]
    OR?: CompanyMemberWhereInput[]
    NOT?: CompanyMemberWhereInput | CompanyMemberWhereInput[]
    id?: StringFilter<"CompanyMember"> | string
    companyId?: StringFilter<"CompanyMember"> | string
    userId?: StringFilter<"CompanyMember"> | string
    role?: StringFilter<"CompanyMember"> | string
    isAdmin?: BoolFilter<"CompanyMember"> | boolean
    canPost?: BoolFilter<"CompanyMember"> | boolean
    createdAt?: DateTimeFilter<"CompanyMember"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CompanyMemberOrderByWithRelationInput = {
    id?: SortOrder
    companyId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    createdAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type CompanyMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CompanyMemberWhereInput | CompanyMemberWhereInput[]
    OR?: CompanyMemberWhereInput[]
    NOT?: CompanyMemberWhereInput | CompanyMemberWhereInput[]
    companyId?: StringFilter<"CompanyMember"> | string
    userId?: StringFilter<"CompanyMember"> | string
    role?: StringFilter<"CompanyMember"> | string
    isAdmin?: BoolFilter<"CompanyMember"> | boolean
    canPost?: BoolFilter<"CompanyMember"> | boolean
    createdAt?: DateTimeFilter<"CompanyMember"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type CompanyMemberOrderByWithAggregationInput = {
    id?: SortOrder
    companyId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    createdAt?: SortOrder
    _count?: CompanyMemberCountOrderByAggregateInput
    _max?: CompanyMemberMaxOrderByAggregateInput
    _min?: CompanyMemberMinOrderByAggregateInput
  }

  export type CompanyMemberScalarWhereWithAggregatesInput = {
    AND?: CompanyMemberScalarWhereWithAggregatesInput | CompanyMemberScalarWhereWithAggregatesInput[]
    OR?: CompanyMemberScalarWhereWithAggregatesInput[]
    NOT?: CompanyMemberScalarWhereWithAggregatesInput | CompanyMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CompanyMember"> | string
    companyId?: StringWithAggregatesFilter<"CompanyMember"> | string
    userId?: StringWithAggregatesFilter<"CompanyMember"> | string
    role?: StringWithAggregatesFilter<"CompanyMember"> | string
    isAdmin?: BoolWithAggregatesFilter<"CompanyMember"> | boolean
    canPost?: BoolWithAggregatesFilter<"CompanyMember"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CompanyMember"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    companyId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    address?: StringFilter<"Project"> | string
    status?: StringFilter<"Project"> | string
    imageUrl?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    rdoCount?: IntFilter<"Project"> | number
    incidentCount?: IntFilter<"Project"> | number
    photoCount?: IntFilter<"Project"> | number
    latitude?: StringFilter<"Project"> | string
    longitude?: StringFilter<"Project"> | string
    city?: StringFilter<"Project"> | string
    state?: StringFilter<"Project"> | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    comments?: CommentListRelationFilter
    rdos?: RDOListRelationFilter
    incidents?: IncidentListRelationFilter
    media?: MediaListRelationFilter
    owners?: ProjectOwnerListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    companyId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    address?: SortOrder
    status?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rdoCount?: SortOrder
    incidentCount?: SortOrder
    photoCount?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    state?: SortOrder
    company?: CompanyOrderByWithRelationInput
    comments?: CommentOrderByRelationAggregateInput
    rdos?: RDOOrderByRelationAggregateInput
    incidents?: IncidentOrderByRelationAggregateInput
    media?: MediaOrderByRelationAggregateInput
    owners?: ProjectOwnerOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    companyId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    address?: StringFilter<"Project"> | string
    status?: StringFilter<"Project"> | string
    imageUrl?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    rdoCount?: IntFilter<"Project"> | number
    incidentCount?: IntFilter<"Project"> | number
    photoCount?: IntFilter<"Project"> | number
    latitude?: StringFilter<"Project"> | string
    longitude?: StringFilter<"Project"> | string
    city?: StringFilter<"Project"> | string
    state?: StringFilter<"Project"> | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    comments?: CommentListRelationFilter
    rdos?: RDOListRelationFilter
    incidents?: IncidentListRelationFilter
    media?: MediaListRelationFilter
    owners?: ProjectOwnerListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    companyId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    address?: SortOrder
    status?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rdoCount?: SortOrder
    incidentCount?: SortOrder
    photoCount?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    state?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _avg?: ProjectAvgOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
    _sum?: ProjectSumOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    companyId?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    address?: StringWithAggregatesFilter<"Project"> | string
    status?: StringWithAggregatesFilter<"Project"> | string
    imageUrl?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    rdoCount?: IntWithAggregatesFilter<"Project"> | number
    incidentCount?: IntWithAggregatesFilter<"Project"> | number
    photoCount?: IntWithAggregatesFilter<"Project"> | number
    latitude?: StringWithAggregatesFilter<"Project"> | string
    longitude?: StringWithAggregatesFilter<"Project"> | string
    city?: StringWithAggregatesFilter<"Project"> | string
    state?: StringWithAggregatesFilter<"Project"> | string
  }

  export type RDOWhereInput = {
    AND?: RDOWhereInput | RDOWhereInput[]
    OR?: RDOWhereInput[]
    NOT?: RDOWhereInput | RDOWhereInput[]
    id?: StringFilter<"RDO"> | string
    projectId?: StringFilter<"RDO"> | string
    authorId?: StringFilter<"RDO"> | string
    rdoNumber?: IntFilter<"RDO"> | number
    date?: DateTimeFilter<"RDO"> | Date | string
    status?: StringFilter<"RDO"> | string
    description?: StringFilter<"RDO"> | string
    weatherMorning?: JsonFilter<"RDO">
    weatherAfternoon?: JsonFilter<"RDO">
    weatherNight?: JsonFilter<"RDO">
    equipmentUsed?: StringFilter<"RDO"> | string
    workforce?: StringFilter<"RDO"> | string
    createdAt?: DateTimeFilter<"RDO"> | Date | string
    updatedAt?: DateTimeFilter<"RDO"> | Date | string
    commentCount?: IntFilter<"RDO"> | number
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    comments?: CommentListRelationFilter
    media?: MediaListRelationFilter
  }

  export type RDOOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    rdoNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    description?: SortOrder
    weatherMorning?: SortOrder
    weatherAfternoon?: SortOrder
    weatherNight?: SortOrder
    equipmentUsed?: SortOrder
    workforce?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
    project?: ProjectOrderByWithRelationInput
    author?: UserOrderByWithRelationInput
    comments?: CommentOrderByRelationAggregateInput
    media?: MediaOrderByRelationAggregateInput
  }

  export type RDOWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectId_rdoNumber?: RDOProjectIdRdoNumberCompoundUniqueInput
    AND?: RDOWhereInput | RDOWhereInput[]
    OR?: RDOWhereInput[]
    NOT?: RDOWhereInput | RDOWhereInput[]
    projectId?: StringFilter<"RDO"> | string
    authorId?: StringFilter<"RDO"> | string
    rdoNumber?: IntFilter<"RDO"> | number
    date?: DateTimeFilter<"RDO"> | Date | string
    status?: StringFilter<"RDO"> | string
    description?: StringFilter<"RDO"> | string
    weatherMorning?: JsonFilter<"RDO">
    weatherAfternoon?: JsonFilter<"RDO">
    weatherNight?: JsonFilter<"RDO">
    equipmentUsed?: StringFilter<"RDO"> | string
    workforce?: StringFilter<"RDO"> | string
    createdAt?: DateTimeFilter<"RDO"> | Date | string
    updatedAt?: DateTimeFilter<"RDO"> | Date | string
    commentCount?: IntFilter<"RDO"> | number
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    comments?: CommentListRelationFilter
    media?: MediaListRelationFilter
  }, "id" | "projectId_rdoNumber">

  export type RDOOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    rdoNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    description?: SortOrder
    weatherMorning?: SortOrder
    weatherAfternoon?: SortOrder
    weatherNight?: SortOrder
    equipmentUsed?: SortOrder
    workforce?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
    _count?: RDOCountOrderByAggregateInput
    _avg?: RDOAvgOrderByAggregateInput
    _max?: RDOMaxOrderByAggregateInput
    _min?: RDOMinOrderByAggregateInput
    _sum?: RDOSumOrderByAggregateInput
  }

  export type RDOScalarWhereWithAggregatesInput = {
    AND?: RDOScalarWhereWithAggregatesInput | RDOScalarWhereWithAggregatesInput[]
    OR?: RDOScalarWhereWithAggregatesInput[]
    NOT?: RDOScalarWhereWithAggregatesInput | RDOScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RDO"> | string
    projectId?: StringWithAggregatesFilter<"RDO"> | string
    authorId?: StringWithAggregatesFilter<"RDO"> | string
    rdoNumber?: IntWithAggregatesFilter<"RDO"> | number
    date?: DateTimeWithAggregatesFilter<"RDO"> | Date | string
    status?: StringWithAggregatesFilter<"RDO"> | string
    description?: StringWithAggregatesFilter<"RDO"> | string
    weatherMorning?: JsonWithAggregatesFilter<"RDO">
    weatherAfternoon?: JsonWithAggregatesFilter<"RDO">
    weatherNight?: JsonWithAggregatesFilter<"RDO">
    equipmentUsed?: StringWithAggregatesFilter<"RDO"> | string
    workforce?: StringWithAggregatesFilter<"RDO"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RDO"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RDO"> | Date | string
    commentCount?: IntWithAggregatesFilter<"RDO"> | number
  }

  export type IncidentWhereInput = {
    AND?: IncidentWhereInput | IncidentWhereInput[]
    OR?: IncidentWhereInput[]
    NOT?: IncidentWhereInput | IncidentWhereInput[]
    id?: StringFilter<"Incident"> | string
    projectId?: StringFilter<"Incident"> | string
    authorId?: StringFilter<"Incident"> | string
    date?: DateTimeFilter<"Incident"> | Date | string
    status?: StringFilter<"Incident"> | string
    priority?: StringFilter<"Incident"> | string
    description?: StringFilter<"Incident"> | string
    createdAt?: DateTimeFilter<"Incident"> | Date | string
    updatedAt?: DateTimeFilter<"Incident"> | Date | string
    commentCount?: IntFilter<"Incident"> | number
    incidentNumber?: IntFilter<"Incident"> | number
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    comments?: CommentListRelationFilter
    media?: MediaListRelationFilter
  }

  export type IncidentOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
    incidentNumber?: SortOrder
    project?: ProjectOrderByWithRelationInput
    author?: UserOrderByWithRelationInput
    comments?: CommentOrderByRelationAggregateInput
    media?: MediaOrderByRelationAggregateInput
  }

  export type IncidentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectId_incidentNumber?: IncidentProjectIdIncidentNumberCompoundUniqueInput
    AND?: IncidentWhereInput | IncidentWhereInput[]
    OR?: IncidentWhereInput[]
    NOT?: IncidentWhereInput | IncidentWhereInput[]
    projectId?: StringFilter<"Incident"> | string
    authorId?: StringFilter<"Incident"> | string
    date?: DateTimeFilter<"Incident"> | Date | string
    status?: StringFilter<"Incident"> | string
    priority?: StringFilter<"Incident"> | string
    description?: StringFilter<"Incident"> | string
    createdAt?: DateTimeFilter<"Incident"> | Date | string
    updatedAt?: DateTimeFilter<"Incident"> | Date | string
    commentCount?: IntFilter<"Incident"> | number
    incidentNumber?: IntFilter<"Incident"> | number
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    comments?: CommentListRelationFilter
    media?: MediaListRelationFilter
  }, "id" | "projectId_incidentNumber">

  export type IncidentOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
    incidentNumber?: SortOrder
    _count?: IncidentCountOrderByAggregateInput
    _avg?: IncidentAvgOrderByAggregateInput
    _max?: IncidentMaxOrderByAggregateInput
    _min?: IncidentMinOrderByAggregateInput
    _sum?: IncidentSumOrderByAggregateInput
  }

  export type IncidentScalarWhereWithAggregatesInput = {
    AND?: IncidentScalarWhereWithAggregatesInput | IncidentScalarWhereWithAggregatesInput[]
    OR?: IncidentScalarWhereWithAggregatesInput[]
    NOT?: IncidentScalarWhereWithAggregatesInput | IncidentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Incident"> | string
    projectId?: StringWithAggregatesFilter<"Incident"> | string
    authorId?: StringWithAggregatesFilter<"Incident"> | string
    date?: DateTimeWithAggregatesFilter<"Incident"> | Date | string
    status?: StringWithAggregatesFilter<"Incident"> | string
    priority?: StringWithAggregatesFilter<"Incident"> | string
    description?: StringWithAggregatesFilter<"Incident"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Incident"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Incident"> | Date | string
    commentCount?: IntWithAggregatesFilter<"Incident"> | number
    incidentNumber?: IntWithAggregatesFilter<"Incident"> | number
  }

  export type MediaWhereInput = {
    AND?: MediaWhereInput | MediaWhereInput[]
    OR?: MediaWhereInput[]
    NOT?: MediaWhereInput | MediaWhereInput[]
    id?: StringFilter<"Media"> | string
    recordId?: StringFilter<"Media"> | string
    recordType?: StringFilter<"Media"> | string
    url?: StringFilter<"Media"> | string
    type?: StringFilter<"Media"> | string
    createdAt?: DateTimeFilter<"Media"> | Date | string
    projectId?: StringFilter<"Media"> | string
    companyId?: StringFilter<"Media"> | string
    rdoId?: StringNullableFilter<"Media"> | string | null
    incidentId?: StringNullableFilter<"Media"> | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    rdo?: XOR<RDONullableScalarRelationFilter, RDOWhereInput> | null
    incident?: XOR<IncidentNullableScalarRelationFilter, IncidentWhereInput> | null
  }

  export type MediaOrderByWithRelationInput = {
    id?: SortOrder
    recordId?: SortOrder
    recordType?: SortOrder
    url?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    projectId?: SortOrder
    companyId?: SortOrder
    rdoId?: SortOrderInput | SortOrder
    incidentId?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
    company?: CompanyOrderByWithRelationInput
    rdo?: RDOOrderByWithRelationInput
    incident?: IncidentOrderByWithRelationInput
  }

  export type MediaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MediaWhereInput | MediaWhereInput[]
    OR?: MediaWhereInput[]
    NOT?: MediaWhereInput | MediaWhereInput[]
    recordId?: StringFilter<"Media"> | string
    recordType?: StringFilter<"Media"> | string
    url?: StringFilter<"Media"> | string
    type?: StringFilter<"Media"> | string
    createdAt?: DateTimeFilter<"Media"> | Date | string
    projectId?: StringFilter<"Media"> | string
    companyId?: StringFilter<"Media"> | string
    rdoId?: StringNullableFilter<"Media"> | string | null
    incidentId?: StringNullableFilter<"Media"> | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    rdo?: XOR<RDONullableScalarRelationFilter, RDOWhereInput> | null
    incident?: XOR<IncidentNullableScalarRelationFilter, IncidentWhereInput> | null
  }, "id">

  export type MediaOrderByWithAggregationInput = {
    id?: SortOrder
    recordId?: SortOrder
    recordType?: SortOrder
    url?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    projectId?: SortOrder
    companyId?: SortOrder
    rdoId?: SortOrderInput | SortOrder
    incidentId?: SortOrderInput | SortOrder
    _count?: MediaCountOrderByAggregateInput
    _max?: MediaMaxOrderByAggregateInput
    _min?: MediaMinOrderByAggregateInput
  }

  export type MediaScalarWhereWithAggregatesInput = {
    AND?: MediaScalarWhereWithAggregatesInput | MediaScalarWhereWithAggregatesInput[]
    OR?: MediaScalarWhereWithAggregatesInput[]
    NOT?: MediaScalarWhereWithAggregatesInput | MediaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Media"> | string
    recordId?: StringWithAggregatesFilter<"Media"> | string
    recordType?: StringWithAggregatesFilter<"Media"> | string
    url?: StringWithAggregatesFilter<"Media"> | string
    type?: StringWithAggregatesFilter<"Media"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Media"> | Date | string
    projectId?: StringWithAggregatesFilter<"Media"> | string
    companyId?: StringWithAggregatesFilter<"Media"> | string
    rdoId?: StringNullableWithAggregatesFilter<"Media"> | string | null
    incidentId?: StringNullableWithAggregatesFilter<"Media"> | string | null
  }

  export type ProjectOwnerWhereInput = {
    AND?: ProjectOwnerWhereInput | ProjectOwnerWhereInput[]
    OR?: ProjectOwnerWhereInput[]
    NOT?: ProjectOwnerWhereInput | ProjectOwnerWhereInput[]
    id?: StringFilter<"ProjectOwner"> | string
    projectId?: StringFilter<"ProjectOwner"> | string
    name?: StringFilter<"ProjectOwner"> | string
    email?: StringFilter<"ProjectOwner"> | string
    phone?: StringFilter<"ProjectOwner"> | string
    createdAt?: DateTimeFilter<"ProjectOwner"> | Date | string
    status?: StringFilter<"ProjectOwner"> | string
    userId?: StringNullableFilter<"ProjectOwner"> | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ProjectOwnerOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    userId?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ProjectOwnerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectOwnerWhereInput | ProjectOwnerWhereInput[]
    OR?: ProjectOwnerWhereInput[]
    NOT?: ProjectOwnerWhereInput | ProjectOwnerWhereInput[]
    projectId?: StringFilter<"ProjectOwner"> | string
    name?: StringFilter<"ProjectOwner"> | string
    email?: StringFilter<"ProjectOwner"> | string
    phone?: StringFilter<"ProjectOwner"> | string
    createdAt?: DateTimeFilter<"ProjectOwner"> | Date | string
    status?: StringFilter<"ProjectOwner"> | string
    userId?: StringNullableFilter<"ProjectOwner"> | string | null
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ProjectOwnerOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: ProjectOwnerCountOrderByAggregateInput
    _max?: ProjectOwnerMaxOrderByAggregateInput
    _min?: ProjectOwnerMinOrderByAggregateInput
  }

  export type ProjectOwnerScalarWhereWithAggregatesInput = {
    AND?: ProjectOwnerScalarWhereWithAggregatesInput | ProjectOwnerScalarWhereWithAggregatesInput[]
    OR?: ProjectOwnerScalarWhereWithAggregatesInput[]
    NOT?: ProjectOwnerScalarWhereWithAggregatesInput | ProjectOwnerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectOwner"> | string
    projectId?: StringWithAggregatesFilter<"ProjectOwner"> | string
    name?: StringWithAggregatesFilter<"ProjectOwner"> | string
    email?: StringWithAggregatesFilter<"ProjectOwner"> | string
    phone?: StringWithAggregatesFilter<"ProjectOwner"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProjectOwner"> | Date | string
    status?: StringWithAggregatesFilter<"ProjectOwner"> | string
    userId?: StringNullableWithAggregatesFilter<"ProjectOwner"> | string | null
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: StringFilter<"Comment"> | string
    content?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
    userId?: StringFilter<"Comment"> | string
    projectId?: StringNullableFilter<"Comment"> | string | null
    rdoId?: StringNullableFilter<"Comment"> | string | null
    incidentId?: StringNullableFilter<"Comment"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
    rdo?: XOR<RDONullableScalarRelationFilter, RDOWhereInput> | null
    incident?: XOR<IncidentNullableScalarRelationFilter, IncidentWhereInput> | null
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    rdoId?: SortOrderInput | SortOrder
    incidentId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    project?: ProjectOrderByWithRelationInput
    rdo?: RDOOrderByWithRelationInput
    incident?: IncidentOrderByWithRelationInput
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    content?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
    userId?: StringFilter<"Comment"> | string
    projectId?: StringNullableFilter<"Comment"> | string | null
    rdoId?: StringNullableFilter<"Comment"> | string | null
    incidentId?: StringNullableFilter<"Comment"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
    rdo?: XOR<RDONullableScalarRelationFilter, RDOWhereInput> | null
    incident?: XOR<IncidentNullableScalarRelationFilter, IncidentWhereInput> | null
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    rdoId?: SortOrderInput | SortOrder
    incidentId?: SortOrderInput | SortOrder
    _count?: CommentCountOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Comment"> | string
    content?: StringWithAggregatesFilter<"Comment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
    userId?: StringWithAggregatesFilter<"Comment"> | string
    projectId?: StringNullableWithAggregatesFilter<"Comment"> | string | null
    rdoId?: StringNullableWithAggregatesFilter<"Comment"> | string | null
    incidentId?: StringNullableWithAggregatesFilter<"Comment"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentCreateNestedManyWithoutUserInput
    company?: CompanyCreateNestedOneWithoutUsersInput
    companyMemberships?: CompanyMemberCreateNestedManyWithoutUserInput
    rdos?: RDOCreateNestedManyWithoutAuthorInput
    incidents?: IncidentCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    companyId?: string | null
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    companyMemberships?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    rdos?: RDOUncheckedCreateNestedManyWithoutAuthorInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUpdateManyWithoutUserNestedInput
    company?: CompanyUpdateOneWithoutUsersNestedInput
    companyMemberships?: CompanyMemberUpdateManyWithoutUserNestedInput
    rdos?: RDOUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    companyMemberships?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    companyId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CompanyCreateInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutCompanyInput
    projects?: ProjectCreateNestedManyWithoutCompanyInput
    members?: CompanyMemberCreateNestedManyWithoutCompanyInput
    media?: MediaCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutCompanyInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCompanyInput
    members?: CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput
    media?: MediaUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutCompanyNestedInput
    projects?: ProjectUpdateManyWithoutCompanyNestedInput
    members?: CompanyMemberUpdateManyWithoutCompanyNestedInput
    media?: MediaUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutCompanyNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCompanyNestedInput
    members?: CompanyMemberUncheckedUpdateManyWithoutCompanyNestedInput
    media?: MediaUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyMemberCreateInput = {
    id?: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt?: Date | string
    company: CompanyCreateNestedOneWithoutMembersInput
    user: UserCreateNestedOneWithoutCompanyMembershipsInput
  }

  export type CompanyMemberUncheckedCreateInput = {
    id?: string
    companyId: string
    userId: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt?: Date | string
  }

  export type CompanyMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneRequiredWithoutCompanyMembershipsNestedInput
  }

  export type CompanyMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyMemberCreateManyInput = {
    id?: string
    companyId: string
    userId: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt?: Date | string
  }

  export type CompanyMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    company: CompanyCreateNestedOneWithoutProjectsInput
    comments?: CommentCreateNestedManyWithoutProjectInput
    rdos?: RDOCreateNestedManyWithoutProjectInput
    incidents?: IncidentCreateNestedManyWithoutProjectInput
    media?: MediaCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    companyId: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    comments?: CommentUncheckedCreateNestedManyWithoutProjectInput
    rdos?: RDOUncheckedCreateNestedManyWithoutProjectInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutProjectInput
    media?: MediaUncheckedCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    company?: CompanyUpdateOneRequiredWithoutProjectsNestedInput
    comments?: CommentUpdateManyWithoutProjectNestedInput
    rdos?: RDOUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUpdateManyWithoutProjectNestedInput
    media?: MediaUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    comments?: CommentUncheckedUpdateManyWithoutProjectNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutProjectNestedInput
    media?: MediaUncheckedUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    companyId: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
  }

  export type RDOCreateInput = {
    id?: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    project: ProjectCreateNestedOneWithoutRdosInput
    author: UserCreateNestedOneWithoutRdosInput
    comments?: CommentCreateNestedManyWithoutRdoInput
    media?: MediaCreateNestedManyWithoutRdoInput
  }

  export type RDOUncheckedCreateInput = {
    id?: string
    projectId: string
    authorId: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    comments?: CommentUncheckedCreateNestedManyWithoutRdoInput
    media?: MediaUncheckedCreateNestedManyWithoutRdoInput
  }

  export type RDOUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutRdosNestedInput
    author?: UserUpdateOneRequiredWithoutRdosNestedInput
    comments?: CommentUpdateManyWithoutRdoNestedInput
    media?: MediaUpdateManyWithoutRdoNestedInput
  }

  export type RDOUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    comments?: CommentUncheckedUpdateManyWithoutRdoNestedInput
    media?: MediaUncheckedUpdateManyWithoutRdoNestedInput
  }

  export type RDOCreateManyInput = {
    id?: string
    projectId: string
    authorId: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
  }

  export type RDOUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
  }

  export type RDOUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
  }

  export type IncidentCreateInput = {
    id?: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    project: ProjectCreateNestedOneWithoutIncidentsInput
    author: UserCreateNestedOneWithoutIncidentsInput
    comments?: CommentCreateNestedManyWithoutIncidentInput
    media?: MediaCreateNestedManyWithoutIncidentInput
  }

  export type IncidentUncheckedCreateInput = {
    id?: string
    projectId: string
    authorId: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    comments?: CommentUncheckedCreateNestedManyWithoutIncidentInput
    media?: MediaUncheckedCreateNestedManyWithoutIncidentInput
  }

  export type IncidentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutIncidentsNestedInput
    author?: UserUpdateOneRequiredWithoutIncidentsNestedInput
    comments?: CommentUpdateManyWithoutIncidentNestedInput
    media?: MediaUpdateManyWithoutIncidentNestedInput
  }

  export type IncidentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    comments?: CommentUncheckedUpdateManyWithoutIncidentNestedInput
    media?: MediaUncheckedUpdateManyWithoutIncidentNestedInput
  }

  export type IncidentCreateManyInput = {
    id?: string
    projectId: string
    authorId: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
  }

  export type IncidentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
  }

  export type IncidentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
  }

  export type MediaCreateInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutMediaInput
    company: CompanyCreateNestedOneWithoutMediaInput
    rdo?: RDOCreateNestedOneWithoutMediaInput
    incident?: IncidentCreateNestedOneWithoutMediaInput
  }

  export type MediaUncheckedCreateInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    projectId: string
    companyId: string
    rdoId?: string | null
    incidentId?: string | null
  }

  export type MediaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutMediaNestedInput
    company?: CompanyUpdateOneRequiredWithoutMediaNestedInput
    rdo?: RDOUpdateOneWithoutMediaNestedInput
    incident?: IncidentUpdateOneWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MediaCreateManyInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    projectId: string
    companyId: string
    rdoId?: string | null
    incidentId?: string | null
  }

  export type MediaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectOwnerCreateInput = {
    id?: string
    name: string
    email: string
    phone: string
    createdAt?: Date | string
    status?: string
    project: ProjectCreateNestedOneWithoutOwnersInput
    user?: UserCreateNestedOneWithoutProjectOwnersInput
  }

  export type ProjectOwnerUncheckedCreateInput = {
    id?: string
    projectId: string
    name: string
    email: string
    phone: string
    createdAt?: Date | string
    status?: string
    userId?: string | null
  }

  export type ProjectOwnerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    project?: ProjectUpdateOneRequiredWithoutOwnersNestedInput
    user?: UserUpdateOneWithoutProjectOwnersNestedInput
  }

  export type ProjectOwnerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectOwnerCreateManyInput = {
    id?: string
    projectId: string
    name: string
    email: string
    phone: string
    createdAt?: Date | string
    status?: string
    userId?: string | null
  }

  export type ProjectOwnerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectOwnerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCommentsInput
    project?: ProjectCreateNestedOneWithoutCommentsInput
    rdo?: RDOCreateNestedOneWithoutCommentsInput
    incident?: IncidentCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    projectId?: string | null
    rdoId?: string | null
    incidentId?: string | null
  }

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
    project?: ProjectUpdateOneWithoutCommentsNestedInput
    rdo?: RDOUpdateOneWithoutCommentsNestedInput
    incident?: IncidentUpdateOneWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateManyInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    projectId?: string | null
    rdoId?: string | null
    incidentId?: string | null
  }

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CommentListRelationFilter = {
    every?: CommentWhereInput
    some?: CommentWhereInput
    none?: CommentWhereInput
  }

  export type CompanyNullableScalarRelationFilter = {
    is?: CompanyWhereInput | null
    isNot?: CompanyWhereInput | null
  }

  export type CompanyMemberListRelationFilter = {
    every?: CompanyMemberWhereInput
    some?: CompanyMemberWhereInput
    none?: CompanyMemberWhereInput
  }

  export type RDOListRelationFilter = {
    every?: RDOWhereInput
    some?: RDOWhereInput
    none?: RDOWhereInput
  }

  export type IncidentListRelationFilter = {
    every?: IncidentWhereInput
    some?: IncidentWhereInput
    none?: IncidentWhereInput
  }

  export type ProjectOwnerListRelationFilter = {
    every?: ProjectOwnerWhereInput
    some?: ProjectOwnerWhereInput
    none?: ProjectOwnerWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RDOOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IncidentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectOwnerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    companyId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    companyId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    clerkId?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    companyId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type MediaListRelationFilter = {
    every?: MediaWhereInput
    some?: MediaWhereInput
    none?: MediaWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MediaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    document?: SortOrder
    documentType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    logoUrl?: SortOrder
    coverUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    document?: SortOrder
    documentType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    logoUrl?: SortOrder
    coverUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    document?: SortOrder
    documentType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    logoUrl?: SortOrder
    coverUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CompanyScalarRelationFilter = {
    is?: CompanyWhereInput
    isNot?: CompanyWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CompanyMemberCountOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    createdAt?: SortOrder
  }

  export type CompanyMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    createdAt?: SortOrder
  }

  export type CompanyMemberMinOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    userId?: SortOrder
    role?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    status?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rdoCount?: SortOrder
    incidentCount?: SortOrder
    photoCount?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    state?: SortOrder
  }

  export type ProjectAvgOrderByAggregateInput = {
    rdoCount?: SortOrder
    incidentCount?: SortOrder
    photoCount?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    status?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rdoCount?: SortOrder
    incidentCount?: SortOrder
    photoCount?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    state?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    status?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    rdoCount?: SortOrder
    incidentCount?: SortOrder
    photoCount?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    state?: SortOrder
  }

  export type ProjectSumOrderByAggregateInput = {
    rdoCount?: SortOrder
    incidentCount?: SortOrder
    photoCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type RDOProjectIdRdoNumberCompoundUniqueInput = {
    projectId: string
    rdoNumber: number
  }

  export type RDOCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    rdoNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    description?: SortOrder
    weatherMorning?: SortOrder
    weatherAfternoon?: SortOrder
    weatherNight?: SortOrder
    equipmentUsed?: SortOrder
    workforce?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
  }

  export type RDOAvgOrderByAggregateInput = {
    rdoNumber?: SortOrder
    commentCount?: SortOrder
  }

  export type RDOMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    rdoNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    description?: SortOrder
    equipmentUsed?: SortOrder
    workforce?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
  }

  export type RDOMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    rdoNumber?: SortOrder
    date?: SortOrder
    status?: SortOrder
    description?: SortOrder
    equipmentUsed?: SortOrder
    workforce?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
  }

  export type RDOSumOrderByAggregateInput = {
    rdoNumber?: SortOrder
    commentCount?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IncidentProjectIdIncidentNumberCompoundUniqueInput = {
    projectId: string
    incidentNumber: number
  }

  export type IncidentCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
    incidentNumber?: SortOrder
  }

  export type IncidentAvgOrderByAggregateInput = {
    commentCount?: SortOrder
    incidentNumber?: SortOrder
  }

  export type IncidentMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
    incidentNumber?: SortOrder
  }

  export type IncidentMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    commentCount?: SortOrder
    incidentNumber?: SortOrder
  }

  export type IncidentSumOrderByAggregateInput = {
    commentCount?: SortOrder
    incidentNumber?: SortOrder
  }

  export type RDONullableScalarRelationFilter = {
    is?: RDOWhereInput | null
    isNot?: RDOWhereInput | null
  }

  export type IncidentNullableScalarRelationFilter = {
    is?: IncidentWhereInput | null
    isNot?: IncidentWhereInput | null
  }

  export type MediaCountOrderByAggregateInput = {
    id?: SortOrder
    recordId?: SortOrder
    recordType?: SortOrder
    url?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    projectId?: SortOrder
    companyId?: SortOrder
    rdoId?: SortOrder
    incidentId?: SortOrder
  }

  export type MediaMaxOrderByAggregateInput = {
    id?: SortOrder
    recordId?: SortOrder
    recordType?: SortOrder
    url?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    projectId?: SortOrder
    companyId?: SortOrder
    rdoId?: SortOrder
    incidentId?: SortOrder
  }

  export type MediaMinOrderByAggregateInput = {
    id?: SortOrder
    recordId?: SortOrder
    recordType?: SortOrder
    url?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    projectId?: SortOrder
    companyId?: SortOrder
    rdoId?: SortOrder
    incidentId?: SortOrder
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ProjectOwnerCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    userId?: SortOrder
  }

  export type ProjectOwnerMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    userId?: SortOrder
  }

  export type ProjectOwnerMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    userId?: SortOrder
  }

  export type ProjectNullableScalarRelationFilter = {
    is?: ProjectWhereInput | null
    isNot?: ProjectWhereInput | null
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    rdoId?: SortOrder
    incidentId?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    rdoId?: SortOrder
    incidentId?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    rdoId?: SortOrder
    incidentId?: SortOrder
  }

  export type CommentCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type CompanyCreateNestedOneWithoutUsersInput = {
    create?: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUsersInput
    connect?: CompanyWhereUniqueInput
  }

  export type CompanyMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<CompanyMemberCreateWithoutUserInput, CompanyMemberUncheckedCreateWithoutUserInput> | CompanyMemberCreateWithoutUserInput[] | CompanyMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutUserInput | CompanyMemberCreateOrConnectWithoutUserInput[]
    createMany?: CompanyMemberCreateManyUserInputEnvelope
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
  }

  export type RDOCreateNestedManyWithoutAuthorInput = {
    create?: XOR<RDOCreateWithoutAuthorInput, RDOUncheckedCreateWithoutAuthorInput> | RDOCreateWithoutAuthorInput[] | RDOUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: RDOCreateOrConnectWithoutAuthorInput | RDOCreateOrConnectWithoutAuthorInput[]
    createMany?: RDOCreateManyAuthorInputEnvelope
    connect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
  }

  export type IncidentCreateNestedManyWithoutAuthorInput = {
    create?: XOR<IncidentCreateWithoutAuthorInput, IncidentUncheckedCreateWithoutAuthorInput> | IncidentCreateWithoutAuthorInput[] | IncidentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: IncidentCreateOrConnectWithoutAuthorInput | IncidentCreateOrConnectWithoutAuthorInput[]
    createMany?: IncidentCreateManyAuthorInputEnvelope
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
  }

  export type ProjectOwnerCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectOwnerCreateWithoutUserInput, ProjectOwnerUncheckedCreateWithoutUserInput> | ProjectOwnerCreateWithoutUserInput[] | ProjectOwnerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectOwnerCreateOrConnectWithoutUserInput | ProjectOwnerCreateOrConnectWithoutUserInput[]
    createMany?: ProjectOwnerCreateManyUserInputEnvelope
    connect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type CompanyMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CompanyMemberCreateWithoutUserInput, CompanyMemberUncheckedCreateWithoutUserInput> | CompanyMemberCreateWithoutUserInput[] | CompanyMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutUserInput | CompanyMemberCreateOrConnectWithoutUserInput[]
    createMany?: CompanyMemberCreateManyUserInputEnvelope
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
  }

  export type RDOUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<RDOCreateWithoutAuthorInput, RDOUncheckedCreateWithoutAuthorInput> | RDOCreateWithoutAuthorInput[] | RDOUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: RDOCreateOrConnectWithoutAuthorInput | RDOCreateOrConnectWithoutAuthorInput[]
    createMany?: RDOCreateManyAuthorInputEnvelope
    connect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
  }

  export type IncidentUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<IncidentCreateWithoutAuthorInput, IncidentUncheckedCreateWithoutAuthorInput> | IncidentCreateWithoutAuthorInput[] | IncidentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: IncidentCreateOrConnectWithoutAuthorInput | IncidentCreateOrConnectWithoutAuthorInput[]
    createMany?: IncidentCreateManyAuthorInputEnvelope
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
  }

  export type ProjectOwnerUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectOwnerCreateWithoutUserInput, ProjectOwnerUncheckedCreateWithoutUserInput> | ProjectOwnerCreateWithoutUserInput[] | ProjectOwnerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectOwnerCreateOrConnectWithoutUserInput | ProjectOwnerCreateOrConnectWithoutUserInput[]
    createMany?: ProjectOwnerCreateManyUserInputEnvelope
    connect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CommentUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type CompanyUpdateOneWithoutUsersNestedInput = {
    create?: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUsersInput
    upsert?: CompanyUpsertWithoutUsersInput
    disconnect?: CompanyWhereInput | boolean
    delete?: CompanyWhereInput | boolean
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutUsersInput, CompanyUpdateWithoutUsersInput>, CompanyUncheckedUpdateWithoutUsersInput>
  }

  export type CompanyMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<CompanyMemberCreateWithoutUserInput, CompanyMemberUncheckedCreateWithoutUserInput> | CompanyMemberCreateWithoutUserInput[] | CompanyMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutUserInput | CompanyMemberCreateOrConnectWithoutUserInput[]
    upsert?: CompanyMemberUpsertWithWhereUniqueWithoutUserInput | CompanyMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CompanyMemberCreateManyUserInputEnvelope
    set?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    disconnect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    delete?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    update?: CompanyMemberUpdateWithWhereUniqueWithoutUserInput | CompanyMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CompanyMemberUpdateManyWithWhereWithoutUserInput | CompanyMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CompanyMemberScalarWhereInput | CompanyMemberScalarWhereInput[]
  }

  export type RDOUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<RDOCreateWithoutAuthorInput, RDOUncheckedCreateWithoutAuthorInput> | RDOCreateWithoutAuthorInput[] | RDOUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: RDOCreateOrConnectWithoutAuthorInput | RDOCreateOrConnectWithoutAuthorInput[]
    upsert?: RDOUpsertWithWhereUniqueWithoutAuthorInput | RDOUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: RDOCreateManyAuthorInputEnvelope
    set?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    disconnect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    delete?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    connect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    update?: RDOUpdateWithWhereUniqueWithoutAuthorInput | RDOUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: RDOUpdateManyWithWhereWithoutAuthorInput | RDOUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: RDOScalarWhereInput | RDOScalarWhereInput[]
  }

  export type IncidentUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<IncidentCreateWithoutAuthorInput, IncidentUncheckedCreateWithoutAuthorInput> | IncidentCreateWithoutAuthorInput[] | IncidentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: IncidentCreateOrConnectWithoutAuthorInput | IncidentCreateOrConnectWithoutAuthorInput[]
    upsert?: IncidentUpsertWithWhereUniqueWithoutAuthorInput | IncidentUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: IncidentCreateManyAuthorInputEnvelope
    set?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    disconnect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    delete?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    update?: IncidentUpdateWithWhereUniqueWithoutAuthorInput | IncidentUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: IncidentUpdateManyWithWhereWithoutAuthorInput | IncidentUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: IncidentScalarWhereInput | IncidentScalarWhereInput[]
  }

  export type ProjectOwnerUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectOwnerCreateWithoutUserInput, ProjectOwnerUncheckedCreateWithoutUserInput> | ProjectOwnerCreateWithoutUserInput[] | ProjectOwnerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectOwnerCreateOrConnectWithoutUserInput | ProjectOwnerCreateOrConnectWithoutUserInput[]
    upsert?: ProjectOwnerUpsertWithWhereUniqueWithoutUserInput | ProjectOwnerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectOwnerCreateManyUserInputEnvelope
    set?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    disconnect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    delete?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    connect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    update?: ProjectOwnerUpdateWithWhereUniqueWithoutUserInput | ProjectOwnerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectOwnerUpdateManyWithWhereWithoutUserInput | ProjectOwnerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectOwnerScalarWhereInput | ProjectOwnerScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type CompanyMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CompanyMemberCreateWithoutUserInput, CompanyMemberUncheckedCreateWithoutUserInput> | CompanyMemberCreateWithoutUserInput[] | CompanyMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutUserInput | CompanyMemberCreateOrConnectWithoutUserInput[]
    upsert?: CompanyMemberUpsertWithWhereUniqueWithoutUserInput | CompanyMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CompanyMemberCreateManyUserInputEnvelope
    set?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    disconnect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    delete?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    update?: CompanyMemberUpdateWithWhereUniqueWithoutUserInput | CompanyMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CompanyMemberUpdateManyWithWhereWithoutUserInput | CompanyMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CompanyMemberScalarWhereInput | CompanyMemberScalarWhereInput[]
  }

  export type RDOUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<RDOCreateWithoutAuthorInput, RDOUncheckedCreateWithoutAuthorInput> | RDOCreateWithoutAuthorInput[] | RDOUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: RDOCreateOrConnectWithoutAuthorInput | RDOCreateOrConnectWithoutAuthorInput[]
    upsert?: RDOUpsertWithWhereUniqueWithoutAuthorInput | RDOUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: RDOCreateManyAuthorInputEnvelope
    set?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    disconnect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    delete?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    connect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    update?: RDOUpdateWithWhereUniqueWithoutAuthorInput | RDOUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: RDOUpdateManyWithWhereWithoutAuthorInput | RDOUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: RDOScalarWhereInput | RDOScalarWhereInput[]
  }

  export type IncidentUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<IncidentCreateWithoutAuthorInput, IncidentUncheckedCreateWithoutAuthorInput> | IncidentCreateWithoutAuthorInput[] | IncidentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: IncidentCreateOrConnectWithoutAuthorInput | IncidentCreateOrConnectWithoutAuthorInput[]
    upsert?: IncidentUpsertWithWhereUniqueWithoutAuthorInput | IncidentUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: IncidentCreateManyAuthorInputEnvelope
    set?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    disconnect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    delete?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    update?: IncidentUpdateWithWhereUniqueWithoutAuthorInput | IncidentUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: IncidentUpdateManyWithWhereWithoutAuthorInput | IncidentUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: IncidentScalarWhereInput | IncidentScalarWhereInput[]
  }

  export type ProjectOwnerUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectOwnerCreateWithoutUserInput, ProjectOwnerUncheckedCreateWithoutUserInput> | ProjectOwnerCreateWithoutUserInput[] | ProjectOwnerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectOwnerCreateOrConnectWithoutUserInput | ProjectOwnerCreateOrConnectWithoutUserInput[]
    upsert?: ProjectOwnerUpsertWithWhereUniqueWithoutUserInput | ProjectOwnerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectOwnerCreateManyUserInputEnvelope
    set?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    disconnect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    delete?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    connect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    update?: ProjectOwnerUpdateWithWhereUniqueWithoutUserInput | ProjectOwnerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectOwnerUpdateManyWithWhereWithoutUserInput | ProjectOwnerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectOwnerScalarWhereInput | ProjectOwnerScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutCompanyInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutCompanyInput = {
    create?: XOR<ProjectCreateWithoutCompanyInput, ProjectUncheckedCreateWithoutCompanyInput> | ProjectCreateWithoutCompanyInput[] | ProjectUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCompanyInput | ProjectCreateOrConnectWithoutCompanyInput[]
    createMany?: ProjectCreateManyCompanyInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type CompanyMemberCreateNestedManyWithoutCompanyInput = {
    create?: XOR<CompanyMemberCreateWithoutCompanyInput, CompanyMemberUncheckedCreateWithoutCompanyInput> | CompanyMemberCreateWithoutCompanyInput[] | CompanyMemberUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutCompanyInput | CompanyMemberCreateOrConnectWithoutCompanyInput[]
    createMany?: CompanyMemberCreateManyCompanyInputEnvelope
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
  }

  export type MediaCreateNestedManyWithoutCompanyInput = {
    create?: XOR<MediaCreateWithoutCompanyInput, MediaUncheckedCreateWithoutCompanyInput> | MediaCreateWithoutCompanyInput[] | MediaUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutCompanyInput | MediaCreateOrConnectWithoutCompanyInput[]
    createMany?: MediaCreateManyCompanyInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<ProjectCreateWithoutCompanyInput, ProjectUncheckedCreateWithoutCompanyInput> | ProjectCreateWithoutCompanyInput[] | ProjectUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCompanyInput | ProjectCreateOrConnectWithoutCompanyInput[]
    createMany?: ProjectCreateManyCompanyInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<CompanyMemberCreateWithoutCompanyInput, CompanyMemberUncheckedCreateWithoutCompanyInput> | CompanyMemberCreateWithoutCompanyInput[] | CompanyMemberUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutCompanyInput | CompanyMemberCreateOrConnectWithoutCompanyInput[]
    createMany?: CompanyMemberCreateManyCompanyInputEnvelope
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
  }

  export type MediaUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<MediaCreateWithoutCompanyInput, MediaUncheckedCreateWithoutCompanyInput> | MediaCreateWithoutCompanyInput[] | MediaUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutCompanyInput | MediaCreateOrConnectWithoutCompanyInput[]
    createMany?: MediaCreateManyCompanyInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutCompanyInput | UserUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutCompanyInput | UserUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: UserUpdateManyWithWhereWithoutCompanyInput | UserUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<ProjectCreateWithoutCompanyInput, ProjectUncheckedCreateWithoutCompanyInput> | ProjectCreateWithoutCompanyInput[] | ProjectUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCompanyInput | ProjectCreateOrConnectWithoutCompanyInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutCompanyInput | ProjectUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: ProjectCreateManyCompanyInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutCompanyInput | ProjectUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutCompanyInput | ProjectUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type CompanyMemberUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<CompanyMemberCreateWithoutCompanyInput, CompanyMemberUncheckedCreateWithoutCompanyInput> | CompanyMemberCreateWithoutCompanyInput[] | CompanyMemberUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutCompanyInput | CompanyMemberCreateOrConnectWithoutCompanyInput[]
    upsert?: CompanyMemberUpsertWithWhereUniqueWithoutCompanyInput | CompanyMemberUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: CompanyMemberCreateManyCompanyInputEnvelope
    set?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    disconnect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    delete?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    update?: CompanyMemberUpdateWithWhereUniqueWithoutCompanyInput | CompanyMemberUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: CompanyMemberUpdateManyWithWhereWithoutCompanyInput | CompanyMemberUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: CompanyMemberScalarWhereInput | CompanyMemberScalarWhereInput[]
  }

  export type MediaUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<MediaCreateWithoutCompanyInput, MediaUncheckedCreateWithoutCompanyInput> | MediaCreateWithoutCompanyInput[] | MediaUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutCompanyInput | MediaCreateOrConnectWithoutCompanyInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutCompanyInput | MediaUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: MediaCreateManyCompanyInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutCompanyInput | MediaUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutCompanyInput | MediaUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutCompanyInput | UserUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutCompanyInput | UserUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: UserUpdateManyWithWhereWithoutCompanyInput | UserUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<ProjectCreateWithoutCompanyInput, ProjectUncheckedCreateWithoutCompanyInput> | ProjectCreateWithoutCompanyInput[] | ProjectUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutCompanyInput | ProjectCreateOrConnectWithoutCompanyInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutCompanyInput | ProjectUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: ProjectCreateManyCompanyInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutCompanyInput | ProjectUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutCompanyInput | ProjectUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type CompanyMemberUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<CompanyMemberCreateWithoutCompanyInput, CompanyMemberUncheckedCreateWithoutCompanyInput> | CompanyMemberCreateWithoutCompanyInput[] | CompanyMemberUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutCompanyInput | CompanyMemberCreateOrConnectWithoutCompanyInput[]
    upsert?: CompanyMemberUpsertWithWhereUniqueWithoutCompanyInput | CompanyMemberUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: CompanyMemberCreateManyCompanyInputEnvelope
    set?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    disconnect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    delete?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
    update?: CompanyMemberUpdateWithWhereUniqueWithoutCompanyInput | CompanyMemberUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: CompanyMemberUpdateManyWithWhereWithoutCompanyInput | CompanyMemberUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: CompanyMemberScalarWhereInput | CompanyMemberScalarWhereInput[]
  }

  export type MediaUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<MediaCreateWithoutCompanyInput, MediaUncheckedCreateWithoutCompanyInput> | MediaCreateWithoutCompanyInput[] | MediaUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutCompanyInput | MediaCreateOrConnectWithoutCompanyInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutCompanyInput | MediaUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: MediaCreateManyCompanyInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutCompanyInput | MediaUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutCompanyInput | MediaUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutMembersInput = {
    create?: XOR<CompanyCreateWithoutMembersInput, CompanyUncheckedCreateWithoutMembersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutMembersInput
    connect?: CompanyWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCompanyMembershipsInput = {
    create?: XOR<UserCreateWithoutCompanyMembershipsInput, UserUncheckedCreateWithoutCompanyMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCompanyMembershipsInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CompanyUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<CompanyCreateWithoutMembersInput, CompanyUncheckedCreateWithoutMembersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutMembersInput
    upsert?: CompanyUpsertWithoutMembersInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutMembersInput, CompanyUpdateWithoutMembersInput>, CompanyUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneRequiredWithoutCompanyMembershipsNestedInput = {
    create?: XOR<UserCreateWithoutCompanyMembershipsInput, UserUncheckedCreateWithoutCompanyMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCompanyMembershipsInput
    upsert?: UserUpsertWithoutCompanyMembershipsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCompanyMembershipsInput, UserUpdateWithoutCompanyMembershipsInput>, UserUncheckedUpdateWithoutCompanyMembershipsInput>
  }

  export type CompanyCreateNestedOneWithoutProjectsInput = {
    create?: XOR<CompanyCreateWithoutProjectsInput, CompanyUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutProjectsInput
    connect?: CompanyWhereUniqueInput
  }

  export type CommentCreateNestedManyWithoutProjectInput = {
    create?: XOR<CommentCreateWithoutProjectInput, CommentUncheckedCreateWithoutProjectInput> | CommentCreateWithoutProjectInput[] | CommentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutProjectInput | CommentCreateOrConnectWithoutProjectInput[]
    createMany?: CommentCreateManyProjectInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type RDOCreateNestedManyWithoutProjectInput = {
    create?: XOR<RDOCreateWithoutProjectInput, RDOUncheckedCreateWithoutProjectInput> | RDOCreateWithoutProjectInput[] | RDOUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RDOCreateOrConnectWithoutProjectInput | RDOCreateOrConnectWithoutProjectInput[]
    createMany?: RDOCreateManyProjectInputEnvelope
    connect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
  }

  export type IncidentCreateNestedManyWithoutProjectInput = {
    create?: XOR<IncidentCreateWithoutProjectInput, IncidentUncheckedCreateWithoutProjectInput> | IncidentCreateWithoutProjectInput[] | IncidentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: IncidentCreateOrConnectWithoutProjectInput | IncidentCreateOrConnectWithoutProjectInput[]
    createMany?: IncidentCreateManyProjectInputEnvelope
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
  }

  export type MediaCreateNestedManyWithoutProjectInput = {
    create?: XOR<MediaCreateWithoutProjectInput, MediaUncheckedCreateWithoutProjectInput> | MediaCreateWithoutProjectInput[] | MediaUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutProjectInput | MediaCreateOrConnectWithoutProjectInput[]
    createMany?: MediaCreateManyProjectInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type ProjectOwnerCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectOwnerCreateWithoutProjectInput, ProjectOwnerUncheckedCreateWithoutProjectInput> | ProjectOwnerCreateWithoutProjectInput[] | ProjectOwnerUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectOwnerCreateOrConnectWithoutProjectInput | ProjectOwnerCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectOwnerCreateManyProjectInputEnvelope
    connect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<CommentCreateWithoutProjectInput, CommentUncheckedCreateWithoutProjectInput> | CommentCreateWithoutProjectInput[] | CommentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutProjectInput | CommentCreateOrConnectWithoutProjectInput[]
    createMany?: CommentCreateManyProjectInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type RDOUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<RDOCreateWithoutProjectInput, RDOUncheckedCreateWithoutProjectInput> | RDOCreateWithoutProjectInput[] | RDOUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RDOCreateOrConnectWithoutProjectInput | RDOCreateOrConnectWithoutProjectInput[]
    createMany?: RDOCreateManyProjectInputEnvelope
    connect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
  }

  export type IncidentUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<IncidentCreateWithoutProjectInput, IncidentUncheckedCreateWithoutProjectInput> | IncidentCreateWithoutProjectInput[] | IncidentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: IncidentCreateOrConnectWithoutProjectInput | IncidentCreateOrConnectWithoutProjectInput[]
    createMany?: IncidentCreateManyProjectInputEnvelope
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
  }

  export type MediaUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<MediaCreateWithoutProjectInput, MediaUncheckedCreateWithoutProjectInput> | MediaCreateWithoutProjectInput[] | MediaUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutProjectInput | MediaCreateOrConnectWithoutProjectInput[]
    createMany?: MediaCreateManyProjectInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type ProjectOwnerUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectOwnerCreateWithoutProjectInput, ProjectOwnerUncheckedCreateWithoutProjectInput> | ProjectOwnerCreateWithoutProjectInput[] | ProjectOwnerUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectOwnerCreateOrConnectWithoutProjectInput | ProjectOwnerCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectOwnerCreateManyProjectInputEnvelope
    connect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CompanyUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<CompanyCreateWithoutProjectsInput, CompanyUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutProjectsInput
    upsert?: CompanyUpsertWithoutProjectsInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutProjectsInput, CompanyUpdateWithoutProjectsInput>, CompanyUncheckedUpdateWithoutProjectsInput>
  }

  export type CommentUpdateManyWithoutProjectNestedInput = {
    create?: XOR<CommentCreateWithoutProjectInput, CommentUncheckedCreateWithoutProjectInput> | CommentCreateWithoutProjectInput[] | CommentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutProjectInput | CommentCreateOrConnectWithoutProjectInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutProjectInput | CommentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: CommentCreateManyProjectInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutProjectInput | CommentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutProjectInput | CommentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type RDOUpdateManyWithoutProjectNestedInput = {
    create?: XOR<RDOCreateWithoutProjectInput, RDOUncheckedCreateWithoutProjectInput> | RDOCreateWithoutProjectInput[] | RDOUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RDOCreateOrConnectWithoutProjectInput | RDOCreateOrConnectWithoutProjectInput[]
    upsert?: RDOUpsertWithWhereUniqueWithoutProjectInput | RDOUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: RDOCreateManyProjectInputEnvelope
    set?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    disconnect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    delete?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    connect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    update?: RDOUpdateWithWhereUniqueWithoutProjectInput | RDOUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: RDOUpdateManyWithWhereWithoutProjectInput | RDOUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: RDOScalarWhereInput | RDOScalarWhereInput[]
  }

  export type IncidentUpdateManyWithoutProjectNestedInput = {
    create?: XOR<IncidentCreateWithoutProjectInput, IncidentUncheckedCreateWithoutProjectInput> | IncidentCreateWithoutProjectInput[] | IncidentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: IncidentCreateOrConnectWithoutProjectInput | IncidentCreateOrConnectWithoutProjectInput[]
    upsert?: IncidentUpsertWithWhereUniqueWithoutProjectInput | IncidentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: IncidentCreateManyProjectInputEnvelope
    set?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    disconnect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    delete?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    update?: IncidentUpdateWithWhereUniqueWithoutProjectInput | IncidentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: IncidentUpdateManyWithWhereWithoutProjectInput | IncidentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: IncidentScalarWhereInput | IncidentScalarWhereInput[]
  }

  export type MediaUpdateManyWithoutProjectNestedInput = {
    create?: XOR<MediaCreateWithoutProjectInput, MediaUncheckedCreateWithoutProjectInput> | MediaCreateWithoutProjectInput[] | MediaUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutProjectInput | MediaCreateOrConnectWithoutProjectInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutProjectInput | MediaUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: MediaCreateManyProjectInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutProjectInput | MediaUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutProjectInput | MediaUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type ProjectOwnerUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectOwnerCreateWithoutProjectInput, ProjectOwnerUncheckedCreateWithoutProjectInput> | ProjectOwnerCreateWithoutProjectInput[] | ProjectOwnerUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectOwnerCreateOrConnectWithoutProjectInput | ProjectOwnerCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectOwnerUpsertWithWhereUniqueWithoutProjectInput | ProjectOwnerUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectOwnerCreateManyProjectInputEnvelope
    set?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    disconnect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    delete?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    connect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    update?: ProjectOwnerUpdateWithWhereUniqueWithoutProjectInput | ProjectOwnerUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectOwnerUpdateManyWithWhereWithoutProjectInput | ProjectOwnerUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectOwnerScalarWhereInput | ProjectOwnerScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<CommentCreateWithoutProjectInput, CommentUncheckedCreateWithoutProjectInput> | CommentCreateWithoutProjectInput[] | CommentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutProjectInput | CommentCreateOrConnectWithoutProjectInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutProjectInput | CommentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: CommentCreateManyProjectInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutProjectInput | CommentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutProjectInput | CommentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type RDOUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<RDOCreateWithoutProjectInput, RDOUncheckedCreateWithoutProjectInput> | RDOCreateWithoutProjectInput[] | RDOUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: RDOCreateOrConnectWithoutProjectInput | RDOCreateOrConnectWithoutProjectInput[]
    upsert?: RDOUpsertWithWhereUniqueWithoutProjectInput | RDOUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: RDOCreateManyProjectInputEnvelope
    set?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    disconnect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    delete?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    connect?: RDOWhereUniqueInput | RDOWhereUniqueInput[]
    update?: RDOUpdateWithWhereUniqueWithoutProjectInput | RDOUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: RDOUpdateManyWithWhereWithoutProjectInput | RDOUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: RDOScalarWhereInput | RDOScalarWhereInput[]
  }

  export type IncidentUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<IncidentCreateWithoutProjectInput, IncidentUncheckedCreateWithoutProjectInput> | IncidentCreateWithoutProjectInput[] | IncidentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: IncidentCreateOrConnectWithoutProjectInput | IncidentCreateOrConnectWithoutProjectInput[]
    upsert?: IncidentUpsertWithWhereUniqueWithoutProjectInput | IncidentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: IncidentCreateManyProjectInputEnvelope
    set?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    disconnect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    delete?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    connect?: IncidentWhereUniqueInput | IncidentWhereUniqueInput[]
    update?: IncidentUpdateWithWhereUniqueWithoutProjectInput | IncidentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: IncidentUpdateManyWithWhereWithoutProjectInput | IncidentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: IncidentScalarWhereInput | IncidentScalarWhereInput[]
  }

  export type MediaUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<MediaCreateWithoutProjectInput, MediaUncheckedCreateWithoutProjectInput> | MediaCreateWithoutProjectInput[] | MediaUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutProjectInput | MediaCreateOrConnectWithoutProjectInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutProjectInput | MediaUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: MediaCreateManyProjectInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutProjectInput | MediaUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutProjectInput | MediaUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type ProjectOwnerUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectOwnerCreateWithoutProjectInput, ProjectOwnerUncheckedCreateWithoutProjectInput> | ProjectOwnerCreateWithoutProjectInput[] | ProjectOwnerUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectOwnerCreateOrConnectWithoutProjectInput | ProjectOwnerCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectOwnerUpsertWithWhereUniqueWithoutProjectInput | ProjectOwnerUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectOwnerCreateManyProjectInputEnvelope
    set?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    disconnect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    delete?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    connect?: ProjectOwnerWhereUniqueInput | ProjectOwnerWhereUniqueInput[]
    update?: ProjectOwnerUpdateWithWhereUniqueWithoutProjectInput | ProjectOwnerUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectOwnerUpdateManyWithWhereWithoutProjectInput | ProjectOwnerUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectOwnerScalarWhereInput | ProjectOwnerScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutRdosInput = {
    create?: XOR<ProjectCreateWithoutRdosInput, ProjectUncheckedCreateWithoutRdosInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRdosInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutRdosInput = {
    create?: XOR<UserCreateWithoutRdosInput, UserUncheckedCreateWithoutRdosInput>
    connectOrCreate?: UserCreateOrConnectWithoutRdosInput
    connect?: UserWhereUniqueInput
  }

  export type CommentCreateNestedManyWithoutRdoInput = {
    create?: XOR<CommentCreateWithoutRdoInput, CommentUncheckedCreateWithoutRdoInput> | CommentCreateWithoutRdoInput[] | CommentUncheckedCreateWithoutRdoInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutRdoInput | CommentCreateOrConnectWithoutRdoInput[]
    createMany?: CommentCreateManyRdoInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type MediaCreateNestedManyWithoutRdoInput = {
    create?: XOR<MediaCreateWithoutRdoInput, MediaUncheckedCreateWithoutRdoInput> | MediaCreateWithoutRdoInput[] | MediaUncheckedCreateWithoutRdoInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutRdoInput | MediaCreateOrConnectWithoutRdoInput[]
    createMany?: MediaCreateManyRdoInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutRdoInput = {
    create?: XOR<CommentCreateWithoutRdoInput, CommentUncheckedCreateWithoutRdoInput> | CommentCreateWithoutRdoInput[] | CommentUncheckedCreateWithoutRdoInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutRdoInput | CommentCreateOrConnectWithoutRdoInput[]
    createMany?: CommentCreateManyRdoInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type MediaUncheckedCreateNestedManyWithoutRdoInput = {
    create?: XOR<MediaCreateWithoutRdoInput, MediaUncheckedCreateWithoutRdoInput> | MediaCreateWithoutRdoInput[] | MediaUncheckedCreateWithoutRdoInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutRdoInput | MediaCreateOrConnectWithoutRdoInput[]
    createMany?: MediaCreateManyRdoInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type ProjectUpdateOneRequiredWithoutRdosNestedInput = {
    create?: XOR<ProjectCreateWithoutRdosInput, ProjectUncheckedCreateWithoutRdosInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutRdosInput
    upsert?: ProjectUpsertWithoutRdosInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutRdosInput, ProjectUpdateWithoutRdosInput>, ProjectUncheckedUpdateWithoutRdosInput>
  }

  export type UserUpdateOneRequiredWithoutRdosNestedInput = {
    create?: XOR<UserCreateWithoutRdosInput, UserUncheckedCreateWithoutRdosInput>
    connectOrCreate?: UserCreateOrConnectWithoutRdosInput
    upsert?: UserUpsertWithoutRdosInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRdosInput, UserUpdateWithoutRdosInput>, UserUncheckedUpdateWithoutRdosInput>
  }

  export type CommentUpdateManyWithoutRdoNestedInput = {
    create?: XOR<CommentCreateWithoutRdoInput, CommentUncheckedCreateWithoutRdoInput> | CommentCreateWithoutRdoInput[] | CommentUncheckedCreateWithoutRdoInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutRdoInput | CommentCreateOrConnectWithoutRdoInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutRdoInput | CommentUpsertWithWhereUniqueWithoutRdoInput[]
    createMany?: CommentCreateManyRdoInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutRdoInput | CommentUpdateWithWhereUniqueWithoutRdoInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutRdoInput | CommentUpdateManyWithWhereWithoutRdoInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type MediaUpdateManyWithoutRdoNestedInput = {
    create?: XOR<MediaCreateWithoutRdoInput, MediaUncheckedCreateWithoutRdoInput> | MediaCreateWithoutRdoInput[] | MediaUncheckedCreateWithoutRdoInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutRdoInput | MediaCreateOrConnectWithoutRdoInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutRdoInput | MediaUpsertWithWhereUniqueWithoutRdoInput[]
    createMany?: MediaCreateManyRdoInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutRdoInput | MediaUpdateWithWhereUniqueWithoutRdoInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutRdoInput | MediaUpdateManyWithWhereWithoutRdoInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutRdoNestedInput = {
    create?: XOR<CommentCreateWithoutRdoInput, CommentUncheckedCreateWithoutRdoInput> | CommentCreateWithoutRdoInput[] | CommentUncheckedCreateWithoutRdoInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutRdoInput | CommentCreateOrConnectWithoutRdoInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutRdoInput | CommentUpsertWithWhereUniqueWithoutRdoInput[]
    createMany?: CommentCreateManyRdoInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutRdoInput | CommentUpdateWithWhereUniqueWithoutRdoInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutRdoInput | CommentUpdateManyWithWhereWithoutRdoInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type MediaUncheckedUpdateManyWithoutRdoNestedInput = {
    create?: XOR<MediaCreateWithoutRdoInput, MediaUncheckedCreateWithoutRdoInput> | MediaCreateWithoutRdoInput[] | MediaUncheckedCreateWithoutRdoInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutRdoInput | MediaCreateOrConnectWithoutRdoInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutRdoInput | MediaUpsertWithWhereUniqueWithoutRdoInput[]
    createMany?: MediaCreateManyRdoInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutRdoInput | MediaUpdateWithWhereUniqueWithoutRdoInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutRdoInput | MediaUpdateManyWithWhereWithoutRdoInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutIncidentsInput = {
    create?: XOR<ProjectCreateWithoutIncidentsInput, ProjectUncheckedCreateWithoutIncidentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutIncidentsInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutIncidentsInput = {
    create?: XOR<UserCreateWithoutIncidentsInput, UserUncheckedCreateWithoutIncidentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutIncidentsInput
    connect?: UserWhereUniqueInput
  }

  export type CommentCreateNestedManyWithoutIncidentInput = {
    create?: XOR<CommentCreateWithoutIncidentInput, CommentUncheckedCreateWithoutIncidentInput> | CommentCreateWithoutIncidentInput[] | CommentUncheckedCreateWithoutIncidentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutIncidentInput | CommentCreateOrConnectWithoutIncidentInput[]
    createMany?: CommentCreateManyIncidentInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type MediaCreateNestedManyWithoutIncidentInput = {
    create?: XOR<MediaCreateWithoutIncidentInput, MediaUncheckedCreateWithoutIncidentInput> | MediaCreateWithoutIncidentInput[] | MediaUncheckedCreateWithoutIncidentInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutIncidentInput | MediaCreateOrConnectWithoutIncidentInput[]
    createMany?: MediaCreateManyIncidentInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutIncidentInput = {
    create?: XOR<CommentCreateWithoutIncidentInput, CommentUncheckedCreateWithoutIncidentInput> | CommentCreateWithoutIncidentInput[] | CommentUncheckedCreateWithoutIncidentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutIncidentInput | CommentCreateOrConnectWithoutIncidentInput[]
    createMany?: CommentCreateManyIncidentInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type MediaUncheckedCreateNestedManyWithoutIncidentInput = {
    create?: XOR<MediaCreateWithoutIncidentInput, MediaUncheckedCreateWithoutIncidentInput> | MediaCreateWithoutIncidentInput[] | MediaUncheckedCreateWithoutIncidentInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutIncidentInput | MediaCreateOrConnectWithoutIncidentInput[]
    createMany?: MediaCreateManyIncidentInputEnvelope
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
  }

  export type ProjectUpdateOneRequiredWithoutIncidentsNestedInput = {
    create?: XOR<ProjectCreateWithoutIncidentsInput, ProjectUncheckedCreateWithoutIncidentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutIncidentsInput
    upsert?: ProjectUpsertWithoutIncidentsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutIncidentsInput, ProjectUpdateWithoutIncidentsInput>, ProjectUncheckedUpdateWithoutIncidentsInput>
  }

  export type UserUpdateOneRequiredWithoutIncidentsNestedInput = {
    create?: XOR<UserCreateWithoutIncidentsInput, UserUncheckedCreateWithoutIncidentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutIncidentsInput
    upsert?: UserUpsertWithoutIncidentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutIncidentsInput, UserUpdateWithoutIncidentsInput>, UserUncheckedUpdateWithoutIncidentsInput>
  }

  export type CommentUpdateManyWithoutIncidentNestedInput = {
    create?: XOR<CommentCreateWithoutIncidentInput, CommentUncheckedCreateWithoutIncidentInput> | CommentCreateWithoutIncidentInput[] | CommentUncheckedCreateWithoutIncidentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutIncidentInput | CommentCreateOrConnectWithoutIncidentInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutIncidentInput | CommentUpsertWithWhereUniqueWithoutIncidentInput[]
    createMany?: CommentCreateManyIncidentInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutIncidentInput | CommentUpdateWithWhereUniqueWithoutIncidentInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutIncidentInput | CommentUpdateManyWithWhereWithoutIncidentInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type MediaUpdateManyWithoutIncidentNestedInput = {
    create?: XOR<MediaCreateWithoutIncidentInput, MediaUncheckedCreateWithoutIncidentInput> | MediaCreateWithoutIncidentInput[] | MediaUncheckedCreateWithoutIncidentInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutIncidentInput | MediaCreateOrConnectWithoutIncidentInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutIncidentInput | MediaUpsertWithWhereUniqueWithoutIncidentInput[]
    createMany?: MediaCreateManyIncidentInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutIncidentInput | MediaUpdateWithWhereUniqueWithoutIncidentInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutIncidentInput | MediaUpdateManyWithWhereWithoutIncidentInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutIncidentNestedInput = {
    create?: XOR<CommentCreateWithoutIncidentInput, CommentUncheckedCreateWithoutIncidentInput> | CommentCreateWithoutIncidentInput[] | CommentUncheckedCreateWithoutIncidentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutIncidentInput | CommentCreateOrConnectWithoutIncidentInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutIncidentInput | CommentUpsertWithWhereUniqueWithoutIncidentInput[]
    createMany?: CommentCreateManyIncidentInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutIncidentInput | CommentUpdateWithWhereUniqueWithoutIncidentInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutIncidentInput | CommentUpdateManyWithWhereWithoutIncidentInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type MediaUncheckedUpdateManyWithoutIncidentNestedInput = {
    create?: XOR<MediaCreateWithoutIncidentInput, MediaUncheckedCreateWithoutIncidentInput> | MediaCreateWithoutIncidentInput[] | MediaUncheckedCreateWithoutIncidentInput[]
    connectOrCreate?: MediaCreateOrConnectWithoutIncidentInput | MediaCreateOrConnectWithoutIncidentInput[]
    upsert?: MediaUpsertWithWhereUniqueWithoutIncidentInput | MediaUpsertWithWhereUniqueWithoutIncidentInput[]
    createMany?: MediaCreateManyIncidentInputEnvelope
    set?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    disconnect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    delete?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    connect?: MediaWhereUniqueInput | MediaWhereUniqueInput[]
    update?: MediaUpdateWithWhereUniqueWithoutIncidentInput | MediaUpdateWithWhereUniqueWithoutIncidentInput[]
    updateMany?: MediaUpdateManyWithWhereWithoutIncidentInput | MediaUpdateManyWithWhereWithoutIncidentInput[]
    deleteMany?: MediaScalarWhereInput | MediaScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutMediaInput = {
    create?: XOR<ProjectCreateWithoutMediaInput, ProjectUncheckedCreateWithoutMediaInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMediaInput
    connect?: ProjectWhereUniqueInput
  }

  export type CompanyCreateNestedOneWithoutMediaInput = {
    create?: XOR<CompanyCreateWithoutMediaInput, CompanyUncheckedCreateWithoutMediaInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutMediaInput
    connect?: CompanyWhereUniqueInput
  }

  export type RDOCreateNestedOneWithoutMediaInput = {
    create?: XOR<RDOCreateWithoutMediaInput, RDOUncheckedCreateWithoutMediaInput>
    connectOrCreate?: RDOCreateOrConnectWithoutMediaInput
    connect?: RDOWhereUniqueInput
  }

  export type IncidentCreateNestedOneWithoutMediaInput = {
    create?: XOR<IncidentCreateWithoutMediaInput, IncidentUncheckedCreateWithoutMediaInput>
    connectOrCreate?: IncidentCreateOrConnectWithoutMediaInput
    connect?: IncidentWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutMediaNestedInput = {
    create?: XOR<ProjectCreateWithoutMediaInput, ProjectUncheckedCreateWithoutMediaInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutMediaInput
    upsert?: ProjectUpsertWithoutMediaInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutMediaInput, ProjectUpdateWithoutMediaInput>, ProjectUncheckedUpdateWithoutMediaInput>
  }

  export type CompanyUpdateOneRequiredWithoutMediaNestedInput = {
    create?: XOR<CompanyCreateWithoutMediaInput, CompanyUncheckedCreateWithoutMediaInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutMediaInput
    upsert?: CompanyUpsertWithoutMediaInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutMediaInput, CompanyUpdateWithoutMediaInput>, CompanyUncheckedUpdateWithoutMediaInput>
  }

  export type RDOUpdateOneWithoutMediaNestedInput = {
    create?: XOR<RDOCreateWithoutMediaInput, RDOUncheckedCreateWithoutMediaInput>
    connectOrCreate?: RDOCreateOrConnectWithoutMediaInput
    upsert?: RDOUpsertWithoutMediaInput
    disconnect?: RDOWhereInput | boolean
    delete?: RDOWhereInput | boolean
    connect?: RDOWhereUniqueInput
    update?: XOR<XOR<RDOUpdateToOneWithWhereWithoutMediaInput, RDOUpdateWithoutMediaInput>, RDOUncheckedUpdateWithoutMediaInput>
  }

  export type IncidentUpdateOneWithoutMediaNestedInput = {
    create?: XOR<IncidentCreateWithoutMediaInput, IncidentUncheckedCreateWithoutMediaInput>
    connectOrCreate?: IncidentCreateOrConnectWithoutMediaInput
    upsert?: IncidentUpsertWithoutMediaInput
    disconnect?: IncidentWhereInput | boolean
    delete?: IncidentWhereInput | boolean
    connect?: IncidentWhereUniqueInput
    update?: XOR<XOR<IncidentUpdateToOneWithWhereWithoutMediaInput, IncidentUpdateWithoutMediaInput>, IncidentUncheckedUpdateWithoutMediaInput>
  }

  export type ProjectCreateNestedOneWithoutOwnersInput = {
    create?: XOR<ProjectCreateWithoutOwnersInput, ProjectUncheckedCreateWithoutOwnersInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnersInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProjectOwnersInput = {
    create?: XOR<UserCreateWithoutProjectOwnersInput, UserUncheckedCreateWithoutProjectOwnersInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectOwnersInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutOwnersNestedInput = {
    create?: XOR<ProjectCreateWithoutOwnersInput, ProjectUncheckedCreateWithoutOwnersInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnersInput
    upsert?: ProjectUpsertWithoutOwnersInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutOwnersInput, ProjectUpdateWithoutOwnersInput>, ProjectUncheckedUpdateWithoutOwnersInput>
  }

  export type UserUpdateOneWithoutProjectOwnersNestedInput = {
    create?: XOR<UserCreateWithoutProjectOwnersInput, UserUncheckedCreateWithoutProjectOwnersInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectOwnersInput
    upsert?: UserUpsertWithoutProjectOwnersInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectOwnersInput, UserUpdateWithoutProjectOwnersInput>, UserUncheckedUpdateWithoutProjectOwnersInput>
  }

  export type UserCreateNestedOneWithoutCommentsInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectCreateNestedOneWithoutCommentsInput = {
    create?: XOR<ProjectCreateWithoutCommentsInput, ProjectUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCommentsInput
    connect?: ProjectWhereUniqueInput
  }

  export type RDOCreateNestedOneWithoutCommentsInput = {
    create?: XOR<RDOCreateWithoutCommentsInput, RDOUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: RDOCreateOrConnectWithoutCommentsInput
    connect?: RDOWhereUniqueInput
  }

  export type IncidentCreateNestedOneWithoutCommentsInput = {
    create?: XOR<IncidentCreateWithoutCommentsInput, IncidentUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: IncidentCreateOrConnectWithoutCommentsInput
    connect?: IncidentWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput
    upsert?: UserUpsertWithoutCommentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommentsInput, UserUpdateWithoutCommentsInput>, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type ProjectUpdateOneWithoutCommentsNestedInput = {
    create?: XOR<ProjectCreateWithoutCommentsInput, ProjectUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutCommentsInput
    upsert?: ProjectUpsertWithoutCommentsInput
    disconnect?: ProjectWhereInput | boolean
    delete?: ProjectWhereInput | boolean
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutCommentsInput, ProjectUpdateWithoutCommentsInput>, ProjectUncheckedUpdateWithoutCommentsInput>
  }

  export type RDOUpdateOneWithoutCommentsNestedInput = {
    create?: XOR<RDOCreateWithoutCommentsInput, RDOUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: RDOCreateOrConnectWithoutCommentsInput
    upsert?: RDOUpsertWithoutCommentsInput
    disconnect?: RDOWhereInput | boolean
    delete?: RDOWhereInput | boolean
    connect?: RDOWhereUniqueInput
    update?: XOR<XOR<RDOUpdateToOneWithWhereWithoutCommentsInput, RDOUpdateWithoutCommentsInput>, RDOUncheckedUpdateWithoutCommentsInput>
  }

  export type IncidentUpdateOneWithoutCommentsNestedInput = {
    create?: XOR<IncidentCreateWithoutCommentsInput, IncidentUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: IncidentCreateOrConnectWithoutCommentsInput
    upsert?: IncidentUpsertWithoutCommentsInput
    disconnect?: IncidentWhereInput | boolean
    delete?: IncidentWhereInput | boolean
    connect?: IncidentWhereUniqueInput
    update?: XOR<XOR<IncidentUpdateToOneWithWhereWithoutCommentsInput, IncidentUpdateWithoutCommentsInput>, IncidentUncheckedUpdateWithoutCommentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type CommentCreateWithoutUserInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project?: ProjectCreateNestedOneWithoutCommentsInput
    rdo?: RDOCreateNestedOneWithoutCommentsInput
    incident?: IncidentCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutUserInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projectId?: string | null
    rdoId?: string | null
    incidentId?: string | null
  }

  export type CommentCreateOrConnectWithoutUserInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentCreateManyUserInputEnvelope = {
    data: CommentCreateManyUserInput | CommentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CompanyCreateWithoutUsersInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutCompanyInput
    members?: CompanyMemberCreateNestedManyWithoutCompanyInput
    media?: MediaCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutCompanyInput
    members?: CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput
    media?: MediaUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutUsersInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
  }

  export type CompanyMemberCreateWithoutUserInput = {
    id?: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt?: Date | string
    company: CompanyCreateNestedOneWithoutMembersInput
  }

  export type CompanyMemberUncheckedCreateWithoutUserInput = {
    id?: string
    companyId: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt?: Date | string
  }

  export type CompanyMemberCreateOrConnectWithoutUserInput = {
    where: CompanyMemberWhereUniqueInput
    create: XOR<CompanyMemberCreateWithoutUserInput, CompanyMemberUncheckedCreateWithoutUserInput>
  }

  export type CompanyMemberCreateManyUserInputEnvelope = {
    data: CompanyMemberCreateManyUserInput | CompanyMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RDOCreateWithoutAuthorInput = {
    id?: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    project: ProjectCreateNestedOneWithoutRdosInput
    comments?: CommentCreateNestedManyWithoutRdoInput
    media?: MediaCreateNestedManyWithoutRdoInput
  }

  export type RDOUncheckedCreateWithoutAuthorInput = {
    id?: string
    projectId: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    comments?: CommentUncheckedCreateNestedManyWithoutRdoInput
    media?: MediaUncheckedCreateNestedManyWithoutRdoInput
  }

  export type RDOCreateOrConnectWithoutAuthorInput = {
    where: RDOWhereUniqueInput
    create: XOR<RDOCreateWithoutAuthorInput, RDOUncheckedCreateWithoutAuthorInput>
  }

  export type RDOCreateManyAuthorInputEnvelope = {
    data: RDOCreateManyAuthorInput | RDOCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type IncidentCreateWithoutAuthorInput = {
    id?: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    project: ProjectCreateNestedOneWithoutIncidentsInput
    comments?: CommentCreateNestedManyWithoutIncidentInput
    media?: MediaCreateNestedManyWithoutIncidentInput
  }

  export type IncidentUncheckedCreateWithoutAuthorInput = {
    id?: string
    projectId: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    comments?: CommentUncheckedCreateNestedManyWithoutIncidentInput
    media?: MediaUncheckedCreateNestedManyWithoutIncidentInput
  }

  export type IncidentCreateOrConnectWithoutAuthorInput = {
    where: IncidentWhereUniqueInput
    create: XOR<IncidentCreateWithoutAuthorInput, IncidentUncheckedCreateWithoutAuthorInput>
  }

  export type IncidentCreateManyAuthorInputEnvelope = {
    data: IncidentCreateManyAuthorInput | IncidentCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type ProjectOwnerCreateWithoutUserInput = {
    id?: string
    name: string
    email: string
    phone: string
    createdAt?: Date | string
    status?: string
    project: ProjectCreateNestedOneWithoutOwnersInput
  }

  export type ProjectOwnerUncheckedCreateWithoutUserInput = {
    id?: string
    projectId: string
    name: string
    email: string
    phone: string
    createdAt?: Date | string
    status?: string
  }

  export type ProjectOwnerCreateOrConnectWithoutUserInput = {
    where: ProjectOwnerWhereUniqueInput
    create: XOR<ProjectOwnerCreateWithoutUserInput, ProjectOwnerUncheckedCreateWithoutUserInput>
  }

  export type ProjectOwnerCreateManyUserInputEnvelope = {
    data: ProjectOwnerCreateManyUserInput | ProjectOwnerCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CommentUpsertWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
  }

  export type CommentUpdateManyWithWhereWithoutUserInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutUserInput>
  }

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[]
    OR?: CommentScalarWhereInput[]
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[]
    id?: StringFilter<"Comment"> | string
    content?: StringFilter<"Comment"> | string
    createdAt?: DateTimeFilter<"Comment"> | Date | string
    updatedAt?: DateTimeFilter<"Comment"> | Date | string
    userId?: StringFilter<"Comment"> | string
    projectId?: StringNullableFilter<"Comment"> | string | null
    rdoId?: StringNullableFilter<"Comment"> | string | null
    incidentId?: StringNullableFilter<"Comment"> | string | null
  }

  export type CompanyUpsertWithoutUsersInput = {
    update: XOR<CompanyUpdateWithoutUsersInput, CompanyUncheckedUpdateWithoutUsersInput>
    create: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutUsersInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutUsersInput, CompanyUncheckedUpdateWithoutUsersInput>
  }

  export type CompanyUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutCompanyNestedInput
    members?: CompanyMemberUpdateManyWithoutCompanyNestedInput
    media?: MediaUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutCompanyNestedInput
    members?: CompanyMemberUncheckedUpdateManyWithoutCompanyNestedInput
    media?: MediaUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: CompanyMemberWhereUniqueInput
    update: XOR<CompanyMemberUpdateWithoutUserInput, CompanyMemberUncheckedUpdateWithoutUserInput>
    create: XOR<CompanyMemberCreateWithoutUserInput, CompanyMemberUncheckedCreateWithoutUserInput>
  }

  export type CompanyMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: CompanyMemberWhereUniqueInput
    data: XOR<CompanyMemberUpdateWithoutUserInput, CompanyMemberUncheckedUpdateWithoutUserInput>
  }

  export type CompanyMemberUpdateManyWithWhereWithoutUserInput = {
    where: CompanyMemberScalarWhereInput
    data: XOR<CompanyMemberUpdateManyMutationInput, CompanyMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type CompanyMemberScalarWhereInput = {
    AND?: CompanyMemberScalarWhereInput | CompanyMemberScalarWhereInput[]
    OR?: CompanyMemberScalarWhereInput[]
    NOT?: CompanyMemberScalarWhereInput | CompanyMemberScalarWhereInput[]
    id?: StringFilter<"CompanyMember"> | string
    companyId?: StringFilter<"CompanyMember"> | string
    userId?: StringFilter<"CompanyMember"> | string
    role?: StringFilter<"CompanyMember"> | string
    isAdmin?: BoolFilter<"CompanyMember"> | boolean
    canPost?: BoolFilter<"CompanyMember"> | boolean
    createdAt?: DateTimeFilter<"CompanyMember"> | Date | string
  }

  export type RDOUpsertWithWhereUniqueWithoutAuthorInput = {
    where: RDOWhereUniqueInput
    update: XOR<RDOUpdateWithoutAuthorInput, RDOUncheckedUpdateWithoutAuthorInput>
    create: XOR<RDOCreateWithoutAuthorInput, RDOUncheckedCreateWithoutAuthorInput>
  }

  export type RDOUpdateWithWhereUniqueWithoutAuthorInput = {
    where: RDOWhereUniqueInput
    data: XOR<RDOUpdateWithoutAuthorInput, RDOUncheckedUpdateWithoutAuthorInput>
  }

  export type RDOUpdateManyWithWhereWithoutAuthorInput = {
    where: RDOScalarWhereInput
    data: XOR<RDOUpdateManyMutationInput, RDOUncheckedUpdateManyWithoutAuthorInput>
  }

  export type RDOScalarWhereInput = {
    AND?: RDOScalarWhereInput | RDOScalarWhereInput[]
    OR?: RDOScalarWhereInput[]
    NOT?: RDOScalarWhereInput | RDOScalarWhereInput[]
    id?: StringFilter<"RDO"> | string
    projectId?: StringFilter<"RDO"> | string
    authorId?: StringFilter<"RDO"> | string
    rdoNumber?: IntFilter<"RDO"> | number
    date?: DateTimeFilter<"RDO"> | Date | string
    status?: StringFilter<"RDO"> | string
    description?: StringFilter<"RDO"> | string
    weatherMorning?: JsonFilter<"RDO">
    weatherAfternoon?: JsonFilter<"RDO">
    weatherNight?: JsonFilter<"RDO">
    equipmentUsed?: StringFilter<"RDO"> | string
    workforce?: StringFilter<"RDO"> | string
    createdAt?: DateTimeFilter<"RDO"> | Date | string
    updatedAt?: DateTimeFilter<"RDO"> | Date | string
    commentCount?: IntFilter<"RDO"> | number
  }

  export type IncidentUpsertWithWhereUniqueWithoutAuthorInput = {
    where: IncidentWhereUniqueInput
    update: XOR<IncidentUpdateWithoutAuthorInput, IncidentUncheckedUpdateWithoutAuthorInput>
    create: XOR<IncidentCreateWithoutAuthorInput, IncidentUncheckedCreateWithoutAuthorInput>
  }

  export type IncidentUpdateWithWhereUniqueWithoutAuthorInput = {
    where: IncidentWhereUniqueInput
    data: XOR<IncidentUpdateWithoutAuthorInput, IncidentUncheckedUpdateWithoutAuthorInput>
  }

  export type IncidentUpdateManyWithWhereWithoutAuthorInput = {
    where: IncidentScalarWhereInput
    data: XOR<IncidentUpdateManyMutationInput, IncidentUncheckedUpdateManyWithoutAuthorInput>
  }

  export type IncidentScalarWhereInput = {
    AND?: IncidentScalarWhereInput | IncidentScalarWhereInput[]
    OR?: IncidentScalarWhereInput[]
    NOT?: IncidentScalarWhereInput | IncidentScalarWhereInput[]
    id?: StringFilter<"Incident"> | string
    projectId?: StringFilter<"Incident"> | string
    authorId?: StringFilter<"Incident"> | string
    date?: DateTimeFilter<"Incident"> | Date | string
    status?: StringFilter<"Incident"> | string
    priority?: StringFilter<"Incident"> | string
    description?: StringFilter<"Incident"> | string
    createdAt?: DateTimeFilter<"Incident"> | Date | string
    updatedAt?: DateTimeFilter<"Incident"> | Date | string
    commentCount?: IntFilter<"Incident"> | number
    incidentNumber?: IntFilter<"Incident"> | number
  }

  export type ProjectOwnerUpsertWithWhereUniqueWithoutUserInput = {
    where: ProjectOwnerWhereUniqueInput
    update: XOR<ProjectOwnerUpdateWithoutUserInput, ProjectOwnerUncheckedUpdateWithoutUserInput>
    create: XOR<ProjectOwnerCreateWithoutUserInput, ProjectOwnerUncheckedCreateWithoutUserInput>
  }

  export type ProjectOwnerUpdateWithWhereUniqueWithoutUserInput = {
    where: ProjectOwnerWhereUniqueInput
    data: XOR<ProjectOwnerUpdateWithoutUserInput, ProjectOwnerUncheckedUpdateWithoutUserInput>
  }

  export type ProjectOwnerUpdateManyWithWhereWithoutUserInput = {
    where: ProjectOwnerScalarWhereInput
    data: XOR<ProjectOwnerUpdateManyMutationInput, ProjectOwnerUncheckedUpdateManyWithoutUserInput>
  }

  export type ProjectOwnerScalarWhereInput = {
    AND?: ProjectOwnerScalarWhereInput | ProjectOwnerScalarWhereInput[]
    OR?: ProjectOwnerScalarWhereInput[]
    NOT?: ProjectOwnerScalarWhereInput | ProjectOwnerScalarWhereInput[]
    id?: StringFilter<"ProjectOwner"> | string
    projectId?: StringFilter<"ProjectOwner"> | string
    name?: StringFilter<"ProjectOwner"> | string
    email?: StringFilter<"ProjectOwner"> | string
    phone?: StringFilter<"ProjectOwner"> | string
    createdAt?: DateTimeFilter<"ProjectOwner"> | Date | string
    status?: StringFilter<"ProjectOwner"> | string
    userId?: StringNullableFilter<"ProjectOwner"> | string | null
  }

  export type UserCreateWithoutCompanyInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentCreateNestedManyWithoutUserInput
    companyMemberships?: CompanyMemberCreateNestedManyWithoutUserInput
    rdos?: RDOCreateNestedManyWithoutAuthorInput
    incidents?: IncidentCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCompanyInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    companyMemberships?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    rdos?: RDOUncheckedCreateNestedManyWithoutAuthorInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCompanyInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput>
  }

  export type UserCreateManyCompanyInputEnvelope = {
    data: UserCreateManyCompanyInput | UserCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type ProjectCreateWithoutCompanyInput = {
    id?: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    comments?: CommentCreateNestedManyWithoutProjectInput
    rdos?: RDOCreateNestedManyWithoutProjectInput
    incidents?: IncidentCreateNestedManyWithoutProjectInput
    media?: MediaCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutCompanyInput = {
    id?: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    comments?: CommentUncheckedCreateNestedManyWithoutProjectInput
    rdos?: RDOUncheckedCreateNestedManyWithoutProjectInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutProjectInput
    media?: MediaUncheckedCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutCompanyInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutCompanyInput, ProjectUncheckedCreateWithoutCompanyInput>
  }

  export type ProjectCreateManyCompanyInputEnvelope = {
    data: ProjectCreateManyCompanyInput | ProjectCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type CompanyMemberCreateWithoutCompanyInput = {
    id?: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCompanyMembershipsInput
  }

  export type CompanyMemberUncheckedCreateWithoutCompanyInput = {
    id?: string
    userId: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt?: Date | string
  }

  export type CompanyMemberCreateOrConnectWithoutCompanyInput = {
    where: CompanyMemberWhereUniqueInput
    create: XOR<CompanyMemberCreateWithoutCompanyInput, CompanyMemberUncheckedCreateWithoutCompanyInput>
  }

  export type CompanyMemberCreateManyCompanyInputEnvelope = {
    data: CompanyMemberCreateManyCompanyInput | CompanyMemberCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type MediaCreateWithoutCompanyInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutMediaInput
    rdo?: RDOCreateNestedOneWithoutMediaInput
    incident?: IncidentCreateNestedOneWithoutMediaInput
  }

  export type MediaUncheckedCreateWithoutCompanyInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    projectId: string
    rdoId?: string | null
    incidentId?: string | null
  }

  export type MediaCreateOrConnectWithoutCompanyInput = {
    where: MediaWhereUniqueInput
    create: XOR<MediaCreateWithoutCompanyInput, MediaUncheckedCreateWithoutCompanyInput>
  }

  export type MediaCreateManyCompanyInputEnvelope = {
    data: MediaCreateManyCompanyInput | MediaCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutCompanyInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutCompanyInput, UserUncheckedUpdateWithoutCompanyInput>
    create: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput>
  }

  export type UserUpdateWithWhereUniqueWithoutCompanyInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutCompanyInput, UserUncheckedUpdateWithoutCompanyInput>
  }

  export type UserUpdateManyWithWhereWithoutCompanyInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutCompanyInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    clerkId?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    companyId?: StringNullableFilter<"User"> | string | null
  }

  export type ProjectUpsertWithWhereUniqueWithoutCompanyInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutCompanyInput, ProjectUncheckedUpdateWithoutCompanyInput>
    create: XOR<ProjectCreateWithoutCompanyInput, ProjectUncheckedCreateWithoutCompanyInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutCompanyInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutCompanyInput, ProjectUncheckedUpdateWithoutCompanyInput>
  }

  export type ProjectUpdateManyWithWhereWithoutCompanyInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutCompanyInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    companyId?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    address?: StringFilter<"Project"> | string
    status?: StringFilter<"Project"> | string
    imageUrl?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    rdoCount?: IntFilter<"Project"> | number
    incidentCount?: IntFilter<"Project"> | number
    photoCount?: IntFilter<"Project"> | number
    latitude?: StringFilter<"Project"> | string
    longitude?: StringFilter<"Project"> | string
    city?: StringFilter<"Project"> | string
    state?: StringFilter<"Project"> | string
  }

  export type CompanyMemberUpsertWithWhereUniqueWithoutCompanyInput = {
    where: CompanyMemberWhereUniqueInput
    update: XOR<CompanyMemberUpdateWithoutCompanyInput, CompanyMemberUncheckedUpdateWithoutCompanyInput>
    create: XOR<CompanyMemberCreateWithoutCompanyInput, CompanyMemberUncheckedCreateWithoutCompanyInput>
  }

  export type CompanyMemberUpdateWithWhereUniqueWithoutCompanyInput = {
    where: CompanyMemberWhereUniqueInput
    data: XOR<CompanyMemberUpdateWithoutCompanyInput, CompanyMemberUncheckedUpdateWithoutCompanyInput>
  }

  export type CompanyMemberUpdateManyWithWhereWithoutCompanyInput = {
    where: CompanyMemberScalarWhereInput
    data: XOR<CompanyMemberUpdateManyMutationInput, CompanyMemberUncheckedUpdateManyWithoutCompanyInput>
  }

  export type MediaUpsertWithWhereUniqueWithoutCompanyInput = {
    where: MediaWhereUniqueInput
    update: XOR<MediaUpdateWithoutCompanyInput, MediaUncheckedUpdateWithoutCompanyInput>
    create: XOR<MediaCreateWithoutCompanyInput, MediaUncheckedCreateWithoutCompanyInput>
  }

  export type MediaUpdateWithWhereUniqueWithoutCompanyInput = {
    where: MediaWhereUniqueInput
    data: XOR<MediaUpdateWithoutCompanyInput, MediaUncheckedUpdateWithoutCompanyInput>
  }

  export type MediaUpdateManyWithWhereWithoutCompanyInput = {
    where: MediaScalarWhereInput
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyWithoutCompanyInput>
  }

  export type MediaScalarWhereInput = {
    AND?: MediaScalarWhereInput | MediaScalarWhereInput[]
    OR?: MediaScalarWhereInput[]
    NOT?: MediaScalarWhereInput | MediaScalarWhereInput[]
    id?: StringFilter<"Media"> | string
    recordId?: StringFilter<"Media"> | string
    recordType?: StringFilter<"Media"> | string
    url?: StringFilter<"Media"> | string
    type?: StringFilter<"Media"> | string
    createdAt?: DateTimeFilter<"Media"> | Date | string
    projectId?: StringFilter<"Media"> | string
    companyId?: StringFilter<"Media"> | string
    rdoId?: StringNullableFilter<"Media"> | string | null
    incidentId?: StringNullableFilter<"Media"> | string | null
  }

  export type CompanyCreateWithoutMembersInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutCompanyInput
    projects?: ProjectCreateNestedManyWithoutCompanyInput
    media?: MediaCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutCompanyInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCompanyInput
    media?: MediaUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutMembersInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutMembersInput, CompanyUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutCompanyMembershipsInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentCreateNestedManyWithoutUserInput
    company?: CompanyCreateNestedOneWithoutUsersInput
    rdos?: RDOCreateNestedManyWithoutAuthorInput
    incidents?: IncidentCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCompanyMembershipsInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    companyId?: string | null
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    rdos?: RDOUncheckedCreateNestedManyWithoutAuthorInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCompanyMembershipsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCompanyMembershipsInput, UserUncheckedCreateWithoutCompanyMembershipsInput>
  }

  export type CompanyUpsertWithoutMembersInput = {
    update: XOR<CompanyUpdateWithoutMembersInput, CompanyUncheckedUpdateWithoutMembersInput>
    create: XOR<CompanyCreateWithoutMembersInput, CompanyUncheckedCreateWithoutMembersInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutMembersInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutMembersInput, CompanyUncheckedUpdateWithoutMembersInput>
  }

  export type CompanyUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutCompanyNestedInput
    projects?: ProjectUpdateManyWithoutCompanyNestedInput
    media?: MediaUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutCompanyNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCompanyNestedInput
    media?: MediaUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type UserUpsertWithoutCompanyMembershipsInput = {
    update: XOR<UserUpdateWithoutCompanyMembershipsInput, UserUncheckedUpdateWithoutCompanyMembershipsInput>
    create: XOR<UserCreateWithoutCompanyMembershipsInput, UserUncheckedCreateWithoutCompanyMembershipsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCompanyMembershipsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCompanyMembershipsInput, UserUncheckedUpdateWithoutCompanyMembershipsInput>
  }

  export type UserUpdateWithoutCompanyMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUpdateManyWithoutUserNestedInput
    company?: CompanyUpdateOneWithoutUsersNestedInput
    rdos?: RDOUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCompanyMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CompanyCreateWithoutProjectsInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutCompanyInput
    members?: CompanyMemberCreateNestedManyWithoutCompanyInput
    media?: MediaCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutProjectsInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutCompanyInput
    members?: CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput
    media?: MediaUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutProjectsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutProjectsInput, CompanyUncheckedCreateWithoutProjectsInput>
  }

  export type CommentCreateWithoutProjectInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCommentsInput
    rdo?: RDOCreateNestedOneWithoutCommentsInput
    incident?: IncidentCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutProjectInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    rdoId?: string | null
    incidentId?: string | null
  }

  export type CommentCreateOrConnectWithoutProjectInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutProjectInput, CommentUncheckedCreateWithoutProjectInput>
  }

  export type CommentCreateManyProjectInputEnvelope = {
    data: CommentCreateManyProjectInput | CommentCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type RDOCreateWithoutProjectInput = {
    id?: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    author: UserCreateNestedOneWithoutRdosInput
    comments?: CommentCreateNestedManyWithoutRdoInput
    media?: MediaCreateNestedManyWithoutRdoInput
  }

  export type RDOUncheckedCreateWithoutProjectInput = {
    id?: string
    authorId: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    comments?: CommentUncheckedCreateNestedManyWithoutRdoInput
    media?: MediaUncheckedCreateNestedManyWithoutRdoInput
  }

  export type RDOCreateOrConnectWithoutProjectInput = {
    where: RDOWhereUniqueInput
    create: XOR<RDOCreateWithoutProjectInput, RDOUncheckedCreateWithoutProjectInput>
  }

  export type RDOCreateManyProjectInputEnvelope = {
    data: RDOCreateManyProjectInput | RDOCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type IncidentCreateWithoutProjectInput = {
    id?: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    author: UserCreateNestedOneWithoutIncidentsInput
    comments?: CommentCreateNestedManyWithoutIncidentInput
    media?: MediaCreateNestedManyWithoutIncidentInput
  }

  export type IncidentUncheckedCreateWithoutProjectInput = {
    id?: string
    authorId: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    comments?: CommentUncheckedCreateNestedManyWithoutIncidentInput
    media?: MediaUncheckedCreateNestedManyWithoutIncidentInput
  }

  export type IncidentCreateOrConnectWithoutProjectInput = {
    where: IncidentWhereUniqueInput
    create: XOR<IncidentCreateWithoutProjectInput, IncidentUncheckedCreateWithoutProjectInput>
  }

  export type IncidentCreateManyProjectInputEnvelope = {
    data: IncidentCreateManyProjectInput | IncidentCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type MediaCreateWithoutProjectInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    company: CompanyCreateNestedOneWithoutMediaInput
    rdo?: RDOCreateNestedOneWithoutMediaInput
    incident?: IncidentCreateNestedOneWithoutMediaInput
  }

  export type MediaUncheckedCreateWithoutProjectInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    companyId: string
    rdoId?: string | null
    incidentId?: string | null
  }

  export type MediaCreateOrConnectWithoutProjectInput = {
    where: MediaWhereUniqueInput
    create: XOR<MediaCreateWithoutProjectInput, MediaUncheckedCreateWithoutProjectInput>
  }

  export type MediaCreateManyProjectInputEnvelope = {
    data: MediaCreateManyProjectInput | MediaCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProjectOwnerCreateWithoutProjectInput = {
    id?: string
    name: string
    email: string
    phone: string
    createdAt?: Date | string
    status?: string
    user?: UserCreateNestedOneWithoutProjectOwnersInput
  }

  export type ProjectOwnerUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    email: string
    phone: string
    createdAt?: Date | string
    status?: string
    userId?: string | null
  }

  export type ProjectOwnerCreateOrConnectWithoutProjectInput = {
    where: ProjectOwnerWhereUniqueInput
    create: XOR<ProjectOwnerCreateWithoutProjectInput, ProjectOwnerUncheckedCreateWithoutProjectInput>
  }

  export type ProjectOwnerCreateManyProjectInputEnvelope = {
    data: ProjectOwnerCreateManyProjectInput | ProjectOwnerCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithoutProjectsInput = {
    update: XOR<CompanyUpdateWithoutProjectsInput, CompanyUncheckedUpdateWithoutProjectsInput>
    create: XOR<CompanyCreateWithoutProjectsInput, CompanyUncheckedCreateWithoutProjectsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutProjectsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutProjectsInput, CompanyUncheckedUpdateWithoutProjectsInput>
  }

  export type CompanyUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutCompanyNestedInput
    members?: CompanyMemberUpdateManyWithoutCompanyNestedInput
    media?: MediaUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutCompanyNestedInput
    members?: CompanyMemberUncheckedUpdateManyWithoutCompanyNestedInput
    media?: MediaUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CommentUpsertWithWhereUniqueWithoutProjectInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutProjectInput, CommentUncheckedUpdateWithoutProjectInput>
    create: XOR<CommentCreateWithoutProjectInput, CommentUncheckedCreateWithoutProjectInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutProjectInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutProjectInput, CommentUncheckedUpdateWithoutProjectInput>
  }

  export type CommentUpdateManyWithWhereWithoutProjectInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutProjectInput>
  }

  export type RDOUpsertWithWhereUniqueWithoutProjectInput = {
    where: RDOWhereUniqueInput
    update: XOR<RDOUpdateWithoutProjectInput, RDOUncheckedUpdateWithoutProjectInput>
    create: XOR<RDOCreateWithoutProjectInput, RDOUncheckedCreateWithoutProjectInput>
  }

  export type RDOUpdateWithWhereUniqueWithoutProjectInput = {
    where: RDOWhereUniqueInput
    data: XOR<RDOUpdateWithoutProjectInput, RDOUncheckedUpdateWithoutProjectInput>
  }

  export type RDOUpdateManyWithWhereWithoutProjectInput = {
    where: RDOScalarWhereInput
    data: XOR<RDOUpdateManyMutationInput, RDOUncheckedUpdateManyWithoutProjectInput>
  }

  export type IncidentUpsertWithWhereUniqueWithoutProjectInput = {
    where: IncidentWhereUniqueInput
    update: XOR<IncidentUpdateWithoutProjectInput, IncidentUncheckedUpdateWithoutProjectInput>
    create: XOR<IncidentCreateWithoutProjectInput, IncidentUncheckedCreateWithoutProjectInput>
  }

  export type IncidentUpdateWithWhereUniqueWithoutProjectInput = {
    where: IncidentWhereUniqueInput
    data: XOR<IncidentUpdateWithoutProjectInput, IncidentUncheckedUpdateWithoutProjectInput>
  }

  export type IncidentUpdateManyWithWhereWithoutProjectInput = {
    where: IncidentScalarWhereInput
    data: XOR<IncidentUpdateManyMutationInput, IncidentUncheckedUpdateManyWithoutProjectInput>
  }

  export type MediaUpsertWithWhereUniqueWithoutProjectInput = {
    where: MediaWhereUniqueInput
    update: XOR<MediaUpdateWithoutProjectInput, MediaUncheckedUpdateWithoutProjectInput>
    create: XOR<MediaCreateWithoutProjectInput, MediaUncheckedCreateWithoutProjectInput>
  }

  export type MediaUpdateWithWhereUniqueWithoutProjectInput = {
    where: MediaWhereUniqueInput
    data: XOR<MediaUpdateWithoutProjectInput, MediaUncheckedUpdateWithoutProjectInput>
  }

  export type MediaUpdateManyWithWhereWithoutProjectInput = {
    where: MediaScalarWhereInput
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectOwnerUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectOwnerWhereUniqueInput
    update: XOR<ProjectOwnerUpdateWithoutProjectInput, ProjectOwnerUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectOwnerCreateWithoutProjectInput, ProjectOwnerUncheckedCreateWithoutProjectInput>
  }

  export type ProjectOwnerUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectOwnerWhereUniqueInput
    data: XOR<ProjectOwnerUpdateWithoutProjectInput, ProjectOwnerUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectOwnerUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectOwnerScalarWhereInput
    data: XOR<ProjectOwnerUpdateManyMutationInput, ProjectOwnerUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectCreateWithoutRdosInput = {
    id?: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    company: CompanyCreateNestedOneWithoutProjectsInput
    comments?: CommentCreateNestedManyWithoutProjectInput
    incidents?: IncidentCreateNestedManyWithoutProjectInput
    media?: MediaCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutRdosInput = {
    id?: string
    companyId: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    comments?: CommentUncheckedCreateNestedManyWithoutProjectInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutProjectInput
    media?: MediaUncheckedCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutRdosInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutRdosInput, ProjectUncheckedCreateWithoutRdosInput>
  }

  export type UserCreateWithoutRdosInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentCreateNestedManyWithoutUserInput
    company?: CompanyCreateNestedOneWithoutUsersInput
    companyMemberships?: CompanyMemberCreateNestedManyWithoutUserInput
    incidents?: IncidentCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRdosInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    companyId?: string | null
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    companyMemberships?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRdosInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRdosInput, UserUncheckedCreateWithoutRdosInput>
  }

  export type CommentCreateWithoutRdoInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCommentsInput
    project?: ProjectCreateNestedOneWithoutCommentsInput
    incident?: IncidentCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutRdoInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    projectId?: string | null
    incidentId?: string | null
  }

  export type CommentCreateOrConnectWithoutRdoInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutRdoInput, CommentUncheckedCreateWithoutRdoInput>
  }

  export type CommentCreateManyRdoInputEnvelope = {
    data: CommentCreateManyRdoInput | CommentCreateManyRdoInput[]
    skipDuplicates?: boolean
  }

  export type MediaCreateWithoutRdoInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutMediaInput
    company: CompanyCreateNestedOneWithoutMediaInput
    incident?: IncidentCreateNestedOneWithoutMediaInput
  }

  export type MediaUncheckedCreateWithoutRdoInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    projectId: string
    companyId: string
    incidentId?: string | null
  }

  export type MediaCreateOrConnectWithoutRdoInput = {
    where: MediaWhereUniqueInput
    create: XOR<MediaCreateWithoutRdoInput, MediaUncheckedCreateWithoutRdoInput>
  }

  export type MediaCreateManyRdoInputEnvelope = {
    data: MediaCreateManyRdoInput | MediaCreateManyRdoInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutRdosInput = {
    update: XOR<ProjectUpdateWithoutRdosInput, ProjectUncheckedUpdateWithoutRdosInput>
    create: XOR<ProjectCreateWithoutRdosInput, ProjectUncheckedCreateWithoutRdosInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutRdosInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutRdosInput, ProjectUncheckedUpdateWithoutRdosInput>
  }

  export type ProjectUpdateWithoutRdosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    company?: CompanyUpdateOneRequiredWithoutProjectsNestedInput
    comments?: CommentUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUpdateManyWithoutProjectNestedInput
    media?: MediaUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutRdosInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    comments?: CommentUncheckedUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutProjectNestedInput
    media?: MediaUncheckedUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutRdosInput = {
    update: XOR<UserUpdateWithoutRdosInput, UserUncheckedUpdateWithoutRdosInput>
    create: XOR<UserCreateWithoutRdosInput, UserUncheckedCreateWithoutRdosInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRdosInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRdosInput, UserUncheckedUpdateWithoutRdosInput>
  }

  export type UserUpdateWithoutRdosInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUpdateManyWithoutUserNestedInput
    company?: CompanyUpdateOneWithoutUsersNestedInput
    companyMemberships?: CompanyMemberUpdateManyWithoutUserNestedInput
    incidents?: IncidentUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRdosInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    companyMemberships?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CommentUpsertWithWhereUniqueWithoutRdoInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutRdoInput, CommentUncheckedUpdateWithoutRdoInput>
    create: XOR<CommentCreateWithoutRdoInput, CommentUncheckedCreateWithoutRdoInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutRdoInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutRdoInput, CommentUncheckedUpdateWithoutRdoInput>
  }

  export type CommentUpdateManyWithWhereWithoutRdoInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutRdoInput>
  }

  export type MediaUpsertWithWhereUniqueWithoutRdoInput = {
    where: MediaWhereUniqueInput
    update: XOR<MediaUpdateWithoutRdoInput, MediaUncheckedUpdateWithoutRdoInput>
    create: XOR<MediaCreateWithoutRdoInput, MediaUncheckedCreateWithoutRdoInput>
  }

  export type MediaUpdateWithWhereUniqueWithoutRdoInput = {
    where: MediaWhereUniqueInput
    data: XOR<MediaUpdateWithoutRdoInput, MediaUncheckedUpdateWithoutRdoInput>
  }

  export type MediaUpdateManyWithWhereWithoutRdoInput = {
    where: MediaScalarWhereInput
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyWithoutRdoInput>
  }

  export type ProjectCreateWithoutIncidentsInput = {
    id?: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    company: CompanyCreateNestedOneWithoutProjectsInput
    comments?: CommentCreateNestedManyWithoutProjectInput
    rdos?: RDOCreateNestedManyWithoutProjectInput
    media?: MediaCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutIncidentsInput = {
    id?: string
    companyId: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    comments?: CommentUncheckedCreateNestedManyWithoutProjectInput
    rdos?: RDOUncheckedCreateNestedManyWithoutProjectInput
    media?: MediaUncheckedCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutIncidentsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutIncidentsInput, ProjectUncheckedCreateWithoutIncidentsInput>
  }

  export type UserCreateWithoutIncidentsInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentCreateNestedManyWithoutUserInput
    company?: CompanyCreateNestedOneWithoutUsersInput
    companyMemberships?: CompanyMemberCreateNestedManyWithoutUserInput
    rdos?: RDOCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutIncidentsInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    companyId?: string | null
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    companyMemberships?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    rdos?: RDOUncheckedCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutIncidentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutIncidentsInput, UserUncheckedCreateWithoutIncidentsInput>
  }

  export type CommentCreateWithoutIncidentInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCommentsInput
    project?: ProjectCreateNestedOneWithoutCommentsInput
    rdo?: RDOCreateNestedOneWithoutCommentsInput
  }

  export type CommentUncheckedCreateWithoutIncidentInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    projectId?: string | null
    rdoId?: string | null
  }

  export type CommentCreateOrConnectWithoutIncidentInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutIncidentInput, CommentUncheckedCreateWithoutIncidentInput>
  }

  export type CommentCreateManyIncidentInputEnvelope = {
    data: CommentCreateManyIncidentInput | CommentCreateManyIncidentInput[]
    skipDuplicates?: boolean
  }

  export type MediaCreateWithoutIncidentInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    project: ProjectCreateNestedOneWithoutMediaInput
    company: CompanyCreateNestedOneWithoutMediaInput
    rdo?: RDOCreateNestedOneWithoutMediaInput
  }

  export type MediaUncheckedCreateWithoutIncidentInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    projectId: string
    companyId: string
    rdoId?: string | null
  }

  export type MediaCreateOrConnectWithoutIncidentInput = {
    where: MediaWhereUniqueInput
    create: XOR<MediaCreateWithoutIncidentInput, MediaUncheckedCreateWithoutIncidentInput>
  }

  export type MediaCreateManyIncidentInputEnvelope = {
    data: MediaCreateManyIncidentInput | MediaCreateManyIncidentInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutIncidentsInput = {
    update: XOR<ProjectUpdateWithoutIncidentsInput, ProjectUncheckedUpdateWithoutIncidentsInput>
    create: XOR<ProjectCreateWithoutIncidentsInput, ProjectUncheckedCreateWithoutIncidentsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutIncidentsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutIncidentsInput, ProjectUncheckedUpdateWithoutIncidentsInput>
  }

  export type ProjectUpdateWithoutIncidentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    company?: CompanyUpdateOneRequiredWithoutProjectsNestedInput
    comments?: CommentUpdateManyWithoutProjectNestedInput
    rdos?: RDOUpdateManyWithoutProjectNestedInput
    media?: MediaUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutIncidentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    comments?: CommentUncheckedUpdateManyWithoutProjectNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutProjectNestedInput
    media?: MediaUncheckedUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutIncidentsInput = {
    update: XOR<UserUpdateWithoutIncidentsInput, UserUncheckedUpdateWithoutIncidentsInput>
    create: XOR<UserCreateWithoutIncidentsInput, UserUncheckedCreateWithoutIncidentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutIncidentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutIncidentsInput, UserUncheckedUpdateWithoutIncidentsInput>
  }

  export type UserUpdateWithoutIncidentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUpdateManyWithoutUserNestedInput
    company?: CompanyUpdateOneWithoutUsersNestedInput
    companyMemberships?: CompanyMemberUpdateManyWithoutUserNestedInput
    rdos?: RDOUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutIncidentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    companyMemberships?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CommentUpsertWithWhereUniqueWithoutIncidentInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutIncidentInput, CommentUncheckedUpdateWithoutIncidentInput>
    create: XOR<CommentCreateWithoutIncidentInput, CommentUncheckedCreateWithoutIncidentInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutIncidentInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutIncidentInput, CommentUncheckedUpdateWithoutIncidentInput>
  }

  export type CommentUpdateManyWithWhereWithoutIncidentInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutIncidentInput>
  }

  export type MediaUpsertWithWhereUniqueWithoutIncidentInput = {
    where: MediaWhereUniqueInput
    update: XOR<MediaUpdateWithoutIncidentInput, MediaUncheckedUpdateWithoutIncidentInput>
    create: XOR<MediaCreateWithoutIncidentInput, MediaUncheckedCreateWithoutIncidentInput>
  }

  export type MediaUpdateWithWhereUniqueWithoutIncidentInput = {
    where: MediaWhereUniqueInput
    data: XOR<MediaUpdateWithoutIncidentInput, MediaUncheckedUpdateWithoutIncidentInput>
  }

  export type MediaUpdateManyWithWhereWithoutIncidentInput = {
    where: MediaScalarWhereInput
    data: XOR<MediaUpdateManyMutationInput, MediaUncheckedUpdateManyWithoutIncidentInput>
  }

  export type ProjectCreateWithoutMediaInput = {
    id?: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    company: CompanyCreateNestedOneWithoutProjectsInput
    comments?: CommentCreateNestedManyWithoutProjectInput
    rdos?: RDOCreateNestedManyWithoutProjectInput
    incidents?: IncidentCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutMediaInput = {
    id?: string
    companyId: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    comments?: CommentUncheckedCreateNestedManyWithoutProjectInput
    rdos?: RDOUncheckedCreateNestedManyWithoutProjectInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutMediaInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutMediaInput, ProjectUncheckedCreateWithoutMediaInput>
  }

  export type CompanyCreateWithoutMediaInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutCompanyInput
    projects?: ProjectCreateNestedManyWithoutCompanyInput
    members?: CompanyMemberCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutMediaInput = {
    id?: string
    name: string
    document: string
    documentType: string
    address: string
    city: string
    state: string
    zipCode: string
    logoUrl?: string | null
    coverUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutCompanyInput
    projects?: ProjectUncheckedCreateNestedManyWithoutCompanyInput
    members?: CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutMediaInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutMediaInput, CompanyUncheckedCreateWithoutMediaInput>
  }

  export type RDOCreateWithoutMediaInput = {
    id?: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    project: ProjectCreateNestedOneWithoutRdosInput
    author: UserCreateNestedOneWithoutRdosInput
    comments?: CommentCreateNestedManyWithoutRdoInput
  }

  export type RDOUncheckedCreateWithoutMediaInput = {
    id?: string
    projectId: string
    authorId: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    comments?: CommentUncheckedCreateNestedManyWithoutRdoInput
  }

  export type RDOCreateOrConnectWithoutMediaInput = {
    where: RDOWhereUniqueInput
    create: XOR<RDOCreateWithoutMediaInput, RDOUncheckedCreateWithoutMediaInput>
  }

  export type IncidentCreateWithoutMediaInput = {
    id?: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    project: ProjectCreateNestedOneWithoutIncidentsInput
    author: UserCreateNestedOneWithoutIncidentsInput
    comments?: CommentCreateNestedManyWithoutIncidentInput
  }

  export type IncidentUncheckedCreateWithoutMediaInput = {
    id?: string
    projectId: string
    authorId: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    comments?: CommentUncheckedCreateNestedManyWithoutIncidentInput
  }

  export type IncidentCreateOrConnectWithoutMediaInput = {
    where: IncidentWhereUniqueInput
    create: XOR<IncidentCreateWithoutMediaInput, IncidentUncheckedCreateWithoutMediaInput>
  }

  export type ProjectUpsertWithoutMediaInput = {
    update: XOR<ProjectUpdateWithoutMediaInput, ProjectUncheckedUpdateWithoutMediaInput>
    create: XOR<ProjectCreateWithoutMediaInput, ProjectUncheckedCreateWithoutMediaInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutMediaInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutMediaInput, ProjectUncheckedUpdateWithoutMediaInput>
  }

  export type ProjectUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    company?: CompanyUpdateOneRequiredWithoutProjectsNestedInput
    comments?: CommentUpdateManyWithoutProjectNestedInput
    rdos?: RDOUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    comments?: CommentUncheckedUpdateManyWithoutProjectNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type CompanyUpsertWithoutMediaInput = {
    update: XOR<CompanyUpdateWithoutMediaInput, CompanyUncheckedUpdateWithoutMediaInput>
    create: XOR<CompanyCreateWithoutMediaInput, CompanyUncheckedCreateWithoutMediaInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutMediaInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutMediaInput, CompanyUncheckedUpdateWithoutMediaInput>
  }

  export type CompanyUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutCompanyNestedInput
    projects?: ProjectUpdateManyWithoutCompanyNestedInput
    members?: CompanyMemberUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    document?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    zipCode?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    coverUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutCompanyNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutCompanyNestedInput
    members?: CompanyMemberUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type RDOUpsertWithoutMediaInput = {
    update: XOR<RDOUpdateWithoutMediaInput, RDOUncheckedUpdateWithoutMediaInput>
    create: XOR<RDOCreateWithoutMediaInput, RDOUncheckedCreateWithoutMediaInput>
    where?: RDOWhereInput
  }

  export type RDOUpdateToOneWithWhereWithoutMediaInput = {
    where?: RDOWhereInput
    data: XOR<RDOUpdateWithoutMediaInput, RDOUncheckedUpdateWithoutMediaInput>
  }

  export type RDOUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutRdosNestedInput
    author?: UserUpdateOneRequiredWithoutRdosNestedInput
    comments?: CommentUpdateManyWithoutRdoNestedInput
  }

  export type RDOUncheckedUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    comments?: CommentUncheckedUpdateManyWithoutRdoNestedInput
  }

  export type IncidentUpsertWithoutMediaInput = {
    update: XOR<IncidentUpdateWithoutMediaInput, IncidentUncheckedUpdateWithoutMediaInput>
    create: XOR<IncidentCreateWithoutMediaInput, IncidentUncheckedCreateWithoutMediaInput>
    where?: IncidentWhereInput
  }

  export type IncidentUpdateToOneWithWhereWithoutMediaInput = {
    where?: IncidentWhereInput
    data: XOR<IncidentUpdateWithoutMediaInput, IncidentUncheckedUpdateWithoutMediaInput>
  }

  export type IncidentUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutIncidentsNestedInput
    author?: UserUpdateOneRequiredWithoutIncidentsNestedInput
    comments?: CommentUpdateManyWithoutIncidentNestedInput
  }

  export type IncidentUncheckedUpdateWithoutMediaInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    comments?: CommentUncheckedUpdateManyWithoutIncidentNestedInput
  }

  export type ProjectCreateWithoutOwnersInput = {
    id?: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    company: CompanyCreateNestedOneWithoutProjectsInput
    comments?: CommentCreateNestedManyWithoutProjectInput
    rdos?: RDOCreateNestedManyWithoutProjectInput
    incidents?: IncidentCreateNestedManyWithoutProjectInput
    media?: MediaCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutOwnersInput = {
    id?: string
    companyId: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    comments?: CommentUncheckedCreateNestedManyWithoutProjectInput
    rdos?: RDOUncheckedCreateNestedManyWithoutProjectInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutProjectInput
    media?: MediaUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutOwnersInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutOwnersInput, ProjectUncheckedCreateWithoutOwnersInput>
  }

  export type UserCreateWithoutProjectOwnersInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: CommentCreateNestedManyWithoutUserInput
    company?: CompanyCreateNestedOneWithoutUsersInput
    companyMemberships?: CompanyMemberCreateNestedManyWithoutUserInput
    rdos?: RDOCreateNestedManyWithoutAuthorInput
    incidents?: IncidentCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutProjectOwnersInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    companyId?: string | null
    comments?: CommentUncheckedCreateNestedManyWithoutUserInput
    companyMemberships?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    rdos?: RDOUncheckedCreateNestedManyWithoutAuthorInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutProjectOwnersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectOwnersInput, UserUncheckedCreateWithoutProjectOwnersInput>
  }

  export type ProjectUpsertWithoutOwnersInput = {
    update: XOR<ProjectUpdateWithoutOwnersInput, ProjectUncheckedUpdateWithoutOwnersInput>
    create: XOR<ProjectCreateWithoutOwnersInput, ProjectUncheckedCreateWithoutOwnersInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutOwnersInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutOwnersInput, ProjectUncheckedUpdateWithoutOwnersInput>
  }

  export type ProjectUpdateWithoutOwnersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    company?: CompanyUpdateOneRequiredWithoutProjectsNestedInput
    comments?: CommentUpdateManyWithoutProjectNestedInput
    rdos?: RDOUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUpdateManyWithoutProjectNestedInput
    media?: MediaUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutOwnersInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    comments?: CommentUncheckedUpdateManyWithoutProjectNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutProjectNestedInput
    media?: MediaUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutProjectOwnersInput = {
    update: XOR<UserUpdateWithoutProjectOwnersInput, UserUncheckedUpdateWithoutProjectOwnersInput>
    create: XOR<UserCreateWithoutProjectOwnersInput, UserUncheckedCreateWithoutProjectOwnersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectOwnersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectOwnersInput, UserUncheckedUpdateWithoutProjectOwnersInput>
  }

  export type UserUpdateWithoutProjectOwnersInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUpdateManyWithoutUserNestedInput
    company?: CompanyUpdateOneWithoutUsersNestedInput
    companyMemberships?: CompanyMemberUpdateManyWithoutUserNestedInput
    rdos?: RDOUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectOwnersInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    companyMemberships?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserCreateWithoutCommentsInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    companyMemberships?: CompanyMemberCreateNestedManyWithoutUserInput
    rdos?: RDOCreateNestedManyWithoutAuthorInput
    incidents?: IncidentCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCommentsInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    companyId?: string | null
    companyMemberships?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    rdos?: RDOUncheckedCreateNestedManyWithoutAuthorInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutAuthorInput
    projectOwners?: ProjectOwnerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCommentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
  }

  export type ProjectCreateWithoutCommentsInput = {
    id?: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    company: CompanyCreateNestedOneWithoutProjectsInput
    rdos?: RDOCreateNestedManyWithoutProjectInput
    incidents?: IncidentCreateNestedManyWithoutProjectInput
    media?: MediaCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutCommentsInput = {
    id?: string
    companyId: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
    rdos?: RDOUncheckedCreateNestedManyWithoutProjectInput
    incidents?: IncidentUncheckedCreateNestedManyWithoutProjectInput
    media?: MediaUncheckedCreateNestedManyWithoutProjectInput
    owners?: ProjectOwnerUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutCommentsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutCommentsInput, ProjectUncheckedCreateWithoutCommentsInput>
  }

  export type RDOCreateWithoutCommentsInput = {
    id?: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    project: ProjectCreateNestedOneWithoutRdosInput
    author: UserCreateNestedOneWithoutRdosInput
    media?: MediaCreateNestedManyWithoutRdoInput
  }

  export type RDOUncheckedCreateWithoutCommentsInput = {
    id?: string
    projectId: string
    authorId: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    media?: MediaUncheckedCreateNestedManyWithoutRdoInput
  }

  export type RDOCreateOrConnectWithoutCommentsInput = {
    where: RDOWhereUniqueInput
    create: XOR<RDOCreateWithoutCommentsInput, RDOUncheckedCreateWithoutCommentsInput>
  }

  export type IncidentCreateWithoutCommentsInput = {
    id?: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    project: ProjectCreateNestedOneWithoutIncidentsInput
    author: UserCreateNestedOneWithoutIncidentsInput
    media?: MediaCreateNestedManyWithoutIncidentInput
  }

  export type IncidentUncheckedCreateWithoutCommentsInput = {
    id?: string
    projectId: string
    authorId: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
    media?: MediaUncheckedCreateNestedManyWithoutIncidentInput
  }

  export type IncidentCreateOrConnectWithoutCommentsInput = {
    where: IncidentWhereUniqueInput
    create: XOR<IncidentCreateWithoutCommentsInput, IncidentUncheckedCreateWithoutCommentsInput>
  }

  export type UserUpsertWithoutCommentsInput = {
    update: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
    create: XOR<UserCreateWithoutCommentsInput, UserUncheckedCreateWithoutCommentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommentsInput, UserUncheckedUpdateWithoutCommentsInput>
  }

  export type UserUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    companyMemberships?: CompanyMemberUpdateManyWithoutUserNestedInput
    rdos?: RDOUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: NullableStringFieldUpdateOperationsInput | string | null
    companyMemberships?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectUpsertWithoutCommentsInput = {
    update: XOR<ProjectUpdateWithoutCommentsInput, ProjectUncheckedUpdateWithoutCommentsInput>
    create: XOR<ProjectCreateWithoutCommentsInput, ProjectUncheckedCreateWithoutCommentsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutCommentsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutCommentsInput, ProjectUncheckedUpdateWithoutCommentsInput>
  }

  export type ProjectUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    company?: CompanyUpdateOneRequiredWithoutProjectsNestedInput
    rdos?: RDOUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUpdateManyWithoutProjectNestedInput
    media?: MediaUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    rdos?: RDOUncheckedUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutProjectNestedInput
    media?: MediaUncheckedUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type RDOUpsertWithoutCommentsInput = {
    update: XOR<RDOUpdateWithoutCommentsInput, RDOUncheckedUpdateWithoutCommentsInput>
    create: XOR<RDOCreateWithoutCommentsInput, RDOUncheckedCreateWithoutCommentsInput>
    where?: RDOWhereInput
  }

  export type RDOUpdateToOneWithWhereWithoutCommentsInput = {
    where?: RDOWhereInput
    data: XOR<RDOUpdateWithoutCommentsInput, RDOUncheckedUpdateWithoutCommentsInput>
  }

  export type RDOUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutRdosNestedInput
    author?: UserUpdateOneRequiredWithoutRdosNestedInput
    media?: MediaUpdateManyWithoutRdoNestedInput
  }

  export type RDOUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    media?: MediaUncheckedUpdateManyWithoutRdoNestedInput
  }

  export type IncidentUpsertWithoutCommentsInput = {
    update: XOR<IncidentUpdateWithoutCommentsInput, IncidentUncheckedUpdateWithoutCommentsInput>
    create: XOR<IncidentCreateWithoutCommentsInput, IncidentUncheckedCreateWithoutCommentsInput>
    where?: IncidentWhereInput
  }

  export type IncidentUpdateToOneWithWhereWithoutCommentsInput = {
    where?: IncidentWhereInput
    data: XOR<IncidentUpdateWithoutCommentsInput, IncidentUncheckedUpdateWithoutCommentsInput>
  }

  export type IncidentUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutIncidentsNestedInput
    author?: UserUpdateOneRequiredWithoutIncidentsNestedInput
    media?: MediaUpdateManyWithoutIncidentNestedInput
  }

  export type IncidentUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    media?: MediaUncheckedUpdateManyWithoutIncidentNestedInput
  }

  export type CommentCreateManyUserInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    projectId?: string | null
    rdoId?: string | null
    incidentId?: string | null
  }

  export type CompanyMemberCreateManyUserInput = {
    id?: string
    companyId: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt?: Date | string
  }

  export type RDOCreateManyAuthorInput = {
    id?: string
    projectId: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
  }

  export type IncidentCreateManyAuthorInput = {
    id?: string
    projectId: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
  }

  export type ProjectOwnerCreateManyUserInput = {
    id?: string
    projectId: string
    name: string
    email: string
    phone: string
    createdAt?: Date | string
    status?: string
  }

  export type CommentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneWithoutCommentsNestedInput
    rdo?: RDOUpdateOneWithoutCommentsNestedInput
    incident?: IncidentUpdateOneWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CompanyMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutMembersNestedInput
  }

  export type CompanyMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RDOUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutRdosNestedInput
    comments?: CommentUpdateManyWithoutRdoNestedInput
    media?: MediaUpdateManyWithoutRdoNestedInput
  }

  export type RDOUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    comments?: CommentUncheckedUpdateManyWithoutRdoNestedInput
    media?: MediaUncheckedUpdateManyWithoutRdoNestedInput
  }

  export type RDOUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
  }

  export type IncidentUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutIncidentsNestedInput
    comments?: CommentUpdateManyWithoutIncidentNestedInput
    media?: MediaUpdateManyWithoutIncidentNestedInput
  }

  export type IncidentUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    comments?: CommentUncheckedUpdateManyWithoutIncidentNestedInput
    media?: MediaUncheckedUpdateManyWithoutIncidentNestedInput
  }

  export type IncidentUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
  }

  export type ProjectOwnerUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    project?: ProjectUpdateOneRequiredWithoutOwnersNestedInput
  }

  export type ProjectOwnerUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectOwnerUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateManyCompanyInput = {
    id?: string
    clerkId: string
    email: string
    phone: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectCreateManyCompanyInput = {
    id?: string
    name: string
    description?: string | null
    address: string
    status?: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    rdoCount?: number
    incidentCount?: number
    photoCount?: number
    latitude: string
    longitude: string
    city: string
    state: string
  }

  export type CompanyMemberCreateManyCompanyInput = {
    id?: string
    userId: string
    role: string
    isAdmin: boolean
    canPost: boolean
    createdAt?: Date | string
  }

  export type MediaCreateManyCompanyInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    projectId: string
    rdoId?: string | null
    incidentId?: string | null
  }

  export type UserUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUpdateManyWithoutUserNestedInput
    companyMemberships?: CompanyMemberUpdateManyWithoutUserNestedInput
    rdos?: RDOUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: CommentUncheckedUpdateManyWithoutUserNestedInput
    companyMemberships?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutAuthorNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutAuthorNestedInput
    projectOwners?: ProjectOwnerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clerkId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    comments?: CommentUpdateManyWithoutProjectNestedInput
    rdos?: RDOUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUpdateManyWithoutProjectNestedInput
    media?: MediaUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    comments?: CommentUncheckedUpdateManyWithoutProjectNestedInput
    rdos?: RDOUncheckedUpdateManyWithoutProjectNestedInput
    incidents?: IncidentUncheckedUpdateManyWithoutProjectNestedInput
    media?: MediaUncheckedUpdateManyWithoutProjectNestedInput
    owners?: ProjectOwnerUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rdoCount?: IntFieldUpdateOperationsInput | number
    incidentCount?: IntFieldUpdateOperationsInput | number
    photoCount?: IntFieldUpdateOperationsInput | number
    latitude?: StringFieldUpdateOperationsInput | string
    longitude?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
  }

  export type CompanyMemberUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCompanyMembershipsNestedInput
  }

  export type CompanyMemberUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyMemberUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutMediaNestedInput
    rdo?: RDOUpdateOneWithoutMediaNestedInput
    incident?: IncidentUpdateOneWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MediaUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateManyProjectInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    rdoId?: string | null
    incidentId?: string | null
  }

  export type RDOCreateManyProjectInput = {
    id?: string
    authorId: string
    rdoNumber: number
    date: Date | string
    status: string
    description: string
    weatherMorning: JsonNullValueInput | InputJsonValue
    weatherAfternoon: JsonNullValueInput | InputJsonValue
    weatherNight: JsonNullValueInput | InputJsonValue
    equipmentUsed: string
    workforce: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
  }

  export type IncidentCreateManyProjectInput = {
    id?: string
    authorId: string
    date: Date | string
    status: string
    priority: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    commentCount?: number
    incidentNumber: number
  }

  export type MediaCreateManyProjectInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    companyId: string
    rdoId?: string | null
    incidentId?: string | null
  }

  export type ProjectOwnerCreateManyProjectInput = {
    id?: string
    name: string
    email: string
    phone: string
    createdAt?: Date | string
    status?: string
    userId?: string | null
  }

  export type CommentUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
    rdo?: RDOUpdateOneWithoutCommentsNestedInput
    incident?: IncidentUpdateOneWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RDOUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    author?: UserUpdateOneRequiredWithoutRdosNestedInput
    comments?: CommentUpdateManyWithoutRdoNestedInput
    media?: MediaUpdateManyWithoutRdoNestedInput
  }

  export type RDOUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    comments?: CommentUncheckedUpdateManyWithoutRdoNestedInput
    media?: MediaUncheckedUpdateManyWithoutRdoNestedInput
  }

  export type RDOUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    rdoNumber?: IntFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    weatherMorning?: JsonNullValueInput | InputJsonValue
    weatherAfternoon?: JsonNullValueInput | InputJsonValue
    weatherNight?: JsonNullValueInput | InputJsonValue
    equipmentUsed?: StringFieldUpdateOperationsInput | string
    workforce?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
  }

  export type IncidentUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    author?: UserUpdateOneRequiredWithoutIncidentsNestedInput
    comments?: CommentUpdateManyWithoutIncidentNestedInput
    media?: MediaUpdateManyWithoutIncidentNestedInput
  }

  export type IncidentUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
    comments?: CommentUncheckedUpdateManyWithoutIncidentNestedInput
    media?: MediaUncheckedUpdateManyWithoutIncidentNestedInput
  }

  export type IncidentUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    commentCount?: IntFieldUpdateOperationsInput | number
    incidentNumber?: IntFieldUpdateOperationsInput | number
  }

  export type MediaUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutMediaNestedInput
    rdo?: RDOUpdateOneWithoutMediaNestedInput
    incident?: IncidentUpdateOneWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MediaUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectOwnerUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneWithoutProjectOwnersNestedInput
  }

  export type ProjectOwnerUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectOwnerUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateManyRdoInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    projectId?: string | null
    incidentId?: string | null
  }

  export type MediaCreateManyRdoInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    projectId: string
    companyId: string
    incidentId?: string | null
  }

  export type CommentUpdateWithoutRdoInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
    project?: ProjectUpdateOneWithoutCommentsNestedInput
    incident?: IncidentUpdateOneWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutRdoInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentUncheckedUpdateManyWithoutRdoInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MediaUpdateWithoutRdoInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutMediaNestedInput
    company?: CompanyUpdateOneRequiredWithoutMediaNestedInput
    incident?: IncidentUpdateOneWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateWithoutRdoInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MediaUncheckedUpdateManyWithoutRdoInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    incidentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateManyIncidentInput = {
    id?: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    projectId?: string | null
    rdoId?: string | null
  }

  export type MediaCreateManyIncidentInput = {
    id?: string
    recordId: string
    recordType: string
    url: string
    type: string
    createdAt?: Date | string
    projectId: string
    companyId: string
    rdoId?: string | null
  }

  export type CommentUpdateWithoutIncidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCommentsNestedInput
    project?: ProjectUpdateOneWithoutCommentsNestedInput
    rdo?: RDOUpdateOneWithoutCommentsNestedInput
  }

  export type CommentUncheckedUpdateWithoutIncidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentUncheckedUpdateManyWithoutIncidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MediaUpdateWithoutIncidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutMediaNestedInput
    company?: CompanyUpdateOneRequiredWithoutMediaNestedInput
    rdo?: RDOUpdateOneWithoutMediaNestedInput
  }

  export type MediaUncheckedUpdateWithoutIncidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MediaUncheckedUpdateManyWithoutIncidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    recordType?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    companyId?: StringFieldUpdateOperationsInput | string
    rdoId?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}