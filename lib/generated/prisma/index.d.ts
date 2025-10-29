
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
 * Model File
 * 
 */
export type File = $Result.DefaultSelection<Prisma.$FilePayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
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
 * Model SubscriptionPlan
 * 
 */
export type SubscriptionPlan = $Result.DefaultSelection<Prisma.$SubscriptionPlanPayload>
/**
 * Model CustomerSubscription
 * 
 */
export type CustomerSubscription = $Result.DefaultSelection<Prisma.$CustomerSubscriptionPayload>
/**
 * Model UsageTracking
 * 
 */
export type UsageTracking = $Result.DefaultSelection<Prisma.$UsageTrackingPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Language: {
  en: 'en',
  pt_BR: 'pt_BR'
};

export type Language = (typeof Language)[keyof typeof Language]


export const Provider: {
  google: 'google',
  local: 'local'
};

export type Provider = (typeof Provider)[keyof typeof Provider]


export const CompanyMemberStatus: {
  invited: 'invited',
  accepted: 'accepted',
  rejected: 'rejected'
};

export type CompanyMemberStatus = (typeof CompanyMemberStatus)[keyof typeof CompanyMemberStatus]


export const Theme: {
  light: 'light',
  dark: 'dark',
  system: 'system'
};

export type Theme = (typeof Theme)[keyof typeof Theme]


export const PlanType: {
  FREE: 'FREE',
  STARTER: 'STARTER',
  PRO: 'PRO',
  BUSINESS: 'BUSINESS',
  ENTERPRISE: 'ENTERPRISE'
};

export type PlanType = (typeof PlanType)[keyof typeof PlanType]


export const BillingInterval: {
  monthly: 'monthly',
  yearly: 'yearly'
};

export type BillingInterval = (typeof BillingInterval)[keyof typeof BillingInterval]


export const SubscriptionStatus: {
  pending: 'pending',
  active: 'active',
  canceled: 'canceled',
  past_due: 'past_due',
  trialing: 'trialing',
  incomplete: 'incomplete',
  incomplete_expired: 'incomplete_expired',
  unpaid: 'unpaid'
};

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]


export const UsageMetricType: {
  ACTIVE_SURVEYS: 'ACTIVE_SURVEYS',
  TOTAL_COMPLETED_RESPONSES: 'TOTAL_COMPLETED_RESPONSES'
};

export type UsageMetricType = (typeof UsageMetricType)[keyof typeof UsageMetricType]

}

export type Language = $Enums.Language

export const Language: typeof $Enums.Language

export type Provider = $Enums.Provider

export const Provider: typeof $Enums.Provider

export type CompanyMemberStatus = $Enums.CompanyMemberStatus

export const CompanyMemberStatus: typeof $Enums.CompanyMemberStatus

export type Theme = $Enums.Theme

export const Theme: typeof $Enums.Theme

export type PlanType = $Enums.PlanType

export const PlanType: typeof $Enums.PlanType

export type BillingInterval = $Enums.BillingInterval

export const BillingInterval: typeof $Enums.BillingInterval

export type SubscriptionStatus = $Enums.SubscriptionStatus

export const SubscriptionStatus: typeof $Enums.SubscriptionStatus

export type UsageMetricType = $Enums.UsageMetricType

export const UsageMetricType: typeof $Enums.UsageMetricType

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
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * `prisma.file`: Exposes CRUD operations for the **File** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Files
    * const files = await prisma.file.findMany()
    * ```
    */
  get file(): Prisma.FileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.subscriptionPlan`: Exposes CRUD operations for the **SubscriptionPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionPlans
    * const subscriptionPlans = await prisma.subscriptionPlan.findMany()
    * ```
    */
  get subscriptionPlan(): Prisma.SubscriptionPlanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customerSubscription`: Exposes CRUD operations for the **CustomerSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomerSubscriptions
    * const customerSubscriptions = await prisma.customerSubscription.findMany()
    * ```
    */
  get customerSubscription(): Prisma.CustomerSubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usageTracking`: Exposes CRUD operations for the **UsageTracking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsageTrackings
    * const usageTrackings = await prisma.usageTracking.findMany()
    * ```
    */
  get usageTracking(): Prisma.UsageTrackingDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
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
    File: 'File',
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken',
    Company: 'Company',
    CompanyMember: 'CompanyMember',
    SubscriptionPlan: 'SubscriptionPlan',
    CustomerSubscription: 'CustomerSubscription',
    UsageTracking: 'UsageTracking'
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
      modelProps: "user" | "file" | "account" | "session" | "verificationToken" | "company" | "companyMember" | "subscriptionPlan" | "customerSubscription" | "usageTracking"
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
      File: {
        payload: Prisma.$FilePayload<ExtArgs>
        fields: Prisma.FileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findFirst: {
            args: Prisma.FileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          findMany: {
            args: Prisma.FileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          create: {
            args: Prisma.FileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          createMany: {
            args: Prisma.FileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          delete: {
            args: Prisma.FileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          update: {
            args: Prisma.FileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          deleteMany: {
            args: Prisma.FileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>[]
          }
          upsert: {
            args: Prisma.FileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilePayload>
          }
          aggregate: {
            args: Prisma.FileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFile>
          }
          groupBy: {
            args: Prisma.FileGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileCountArgs<ExtArgs>
            result: $Utils.Optional<FileCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
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
      SubscriptionPlan: {
        payload: Prisma.$SubscriptionPlanPayload<ExtArgs>
        fields: Prisma.SubscriptionPlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionPlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionPlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionPlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          findMany: {
            args: Prisma.SubscriptionPlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[]
          }
          create: {
            args: Prisma.SubscriptionPlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          createMany: {
            args: Prisma.SubscriptionPlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionPlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionPlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          update: {
            args: Prisma.SubscriptionPlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionPlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionPlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionPlanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionPlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPlanPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionPlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptionPlan>
          }
          groupBy: {
            args: Prisma.SubscriptionPlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionPlanCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionPlanCountAggregateOutputType> | number
          }
        }
      }
      CustomerSubscription: {
        payload: Prisma.$CustomerSubscriptionPayload<ExtArgs>
        fields: Prisma.CustomerSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.CustomerSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload>
          }
          findMany: {
            args: Prisma.CustomerSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload>[]
          }
          create: {
            args: Prisma.CustomerSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload>
          }
          createMany: {
            args: Prisma.CustomerSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.CustomerSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload>
          }
          update: {
            args: Prisma.CustomerSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.CustomerSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomerSubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.CustomerSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.CustomerSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomerSubscription>
          }
          groupBy: {
            args: Prisma.CustomerSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      UsageTracking: {
        payload: Prisma.$UsageTrackingPayload<ExtArgs>
        fields: Prisma.UsageTrackingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsageTrackingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsageTrackingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload>
          }
          findFirst: {
            args: Prisma.UsageTrackingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsageTrackingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload>
          }
          findMany: {
            args: Prisma.UsageTrackingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload>[]
          }
          create: {
            args: Prisma.UsageTrackingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload>
          }
          createMany: {
            args: Prisma.UsageTrackingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsageTrackingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload>[]
          }
          delete: {
            args: Prisma.UsageTrackingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload>
          }
          update: {
            args: Prisma.UsageTrackingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload>
          }
          deleteMany: {
            args: Prisma.UsageTrackingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsageTrackingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsageTrackingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload>[]
          }
          upsert: {
            args: Prisma.UsageTrackingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageTrackingPayload>
          }
          aggregate: {
            args: Prisma.UsageTrackingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsageTracking>
          }
          groupBy: {
            args: Prisma.UsageTrackingGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsageTrackingGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsageTrackingCountArgs<ExtArgs>
            result: $Utils.Optional<UsageTrackingCountAggregateOutputType> | number
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
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
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
    file?: FileOmit
    account?: AccountOmit
    session?: SessionOmit
    verificationToken?: VerificationTokenOmit
    company?: CompanyOmit
    companyMember?: CompanyMemberOmit
    subscriptionPlan?: SubscriptionPlanOmit
    customerSubscription?: CustomerSubscriptionOmit
    usageTracking?: UsageTrackingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    accounts: number
    sessions: number
    companyMembers: number
    files: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    companyMembers?: boolean | UserCountOutputTypeCountCompanyMembersArgs
    files?: boolean | UserCountOutputTypeCountFilesArgs
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
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCompanyMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
  }


  /**
   * Count Type FileCountOutputType
   */

  export type FileCountOutputType = {
    avatarFor: number
  }

  export type FileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    avatarFor?: boolean | FileCountOutputTypeCountAvatarForArgs
  }

  // Custom InputTypes
  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileCountOutputType
     */
    select?: FileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FileCountOutputType without action
   */
  export type FileCountOutputTypeCountAvatarForArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    members: number
    user: number
    CustomerSubscription: number
    UsageTracking: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | CompanyCountOutputTypeCountMembersArgs
    user?: boolean | CompanyCountOutputTypeCountUserArgs
    CustomerSubscription?: boolean | CompanyCountOutputTypeCountCustomerSubscriptionArgs
    UsageTracking?: boolean | CompanyCountOutputTypeCountUsageTrackingArgs
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
  export type CompanyCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyMemberWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountCustomerSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerSubscriptionWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountUsageTrackingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageTrackingWhereInput
  }


  /**
   * Count Type SubscriptionPlanCountOutputType
   */

  export type SubscriptionPlanCountOutputType = {
    subscriptions: number
  }

  export type SubscriptionPlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | SubscriptionPlanCountOutputTypeCountSubscriptionsArgs
  }

  // Custom InputTypes
  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanCountOutputType
     */
    select?: SubscriptionPlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubscriptionPlanCountOutputType without action
   */
  export type SubscriptionPlanCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerSubscriptionWhereInput
  }


  /**
   * Count Type CustomerSubscriptionCountOutputType
   */

  export type CustomerSubscriptionCountOutputType = {
    usageTracking: number
  }

  export type CustomerSubscriptionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usageTracking?: boolean | CustomerSubscriptionCountOutputTypeCountUsageTrackingArgs
  }

  // Custom InputTypes
  /**
   * CustomerSubscriptionCountOutputType without action
   */
  export type CustomerSubscriptionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscriptionCountOutputType
     */
    select?: CustomerSubscriptionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerSubscriptionCountOutputType without action
   */
  export type CustomerSubscriptionCountOutputTypeCountUsageTrackingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageTrackingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    defaultCompanyId: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    defaultCompanyId: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    provider: $Enums.Provider | null
    password: string | null
    resetPasswordToken: string | null
    confirmationToken: string | null
    confirmed: boolean | null
    blocked: boolean | null
    phone: string | null
    firstName: string | null
    lastName: string | null
    position: string | null
    companyName: string | null
    country: string | null
    linkedinUrl: string | null
    twitterUrl: string | null
    websiteUrl: string | null
    githubUrl: string | null
    avatarUrl: string | null
    language: $Enums.Language | null
    createdAt: Date | null
    updatedAt: Date | null
    avatarId: string | null
    idProvider: string | null
    resetPasswordExpires: Date | null
    theme: $Enums.Theme | null
    defaultCompanyId: number | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    provider: $Enums.Provider | null
    password: string | null
    resetPasswordToken: string | null
    confirmationToken: string | null
    confirmed: boolean | null
    blocked: boolean | null
    phone: string | null
    firstName: string | null
    lastName: string | null
    position: string | null
    companyName: string | null
    country: string | null
    linkedinUrl: string | null
    twitterUrl: string | null
    websiteUrl: string | null
    githubUrl: string | null
    avatarUrl: string | null
    language: $Enums.Language | null
    createdAt: Date | null
    updatedAt: Date | null
    avatarId: string | null
    idProvider: string | null
    resetPasswordExpires: Date | null
    theme: $Enums.Theme | null
    defaultCompanyId: number | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    provider: number
    password: number
    resetPasswordToken: number
    confirmationToken: number
    confirmed: number
    blocked: number
    phone: number
    firstName: number
    lastName: number
    position: number
    companyName: number
    country: number
    linkedinUrl: number
    twitterUrl: number
    websiteUrl: number
    githubUrl: number
    avatarUrl: number
    language: number
    createdAt: number
    updatedAt: number
    avatarId: number
    idProvider: number
    resetPasswordExpires: number
    theme: number
    defaultCompanyId: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    defaultCompanyId?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    defaultCompanyId?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    provider?: true
    password?: true
    resetPasswordToken?: true
    confirmationToken?: true
    confirmed?: true
    blocked?: true
    phone?: true
    firstName?: true
    lastName?: true
    position?: true
    companyName?: true
    country?: true
    linkedinUrl?: true
    twitterUrl?: true
    websiteUrl?: true
    githubUrl?: true
    avatarUrl?: true
    language?: true
    createdAt?: true
    updatedAt?: true
    avatarId?: true
    idProvider?: true
    resetPasswordExpires?: true
    theme?: true
    defaultCompanyId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    provider?: true
    password?: true
    resetPasswordToken?: true
    confirmationToken?: true
    confirmed?: true
    blocked?: true
    phone?: true
    firstName?: true
    lastName?: true
    position?: true
    companyName?: true
    country?: true
    linkedinUrl?: true
    twitterUrl?: true
    websiteUrl?: true
    githubUrl?: true
    avatarUrl?: true
    language?: true
    createdAt?: true
    updatedAt?: true
    avatarId?: true
    idProvider?: true
    resetPasswordExpires?: true
    theme?: true
    defaultCompanyId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    provider?: true
    password?: true
    resetPasswordToken?: true
    confirmationToken?: true
    confirmed?: true
    blocked?: true
    phone?: true
    firstName?: true
    lastName?: true
    position?: true
    companyName?: true
    country?: true
    linkedinUrl?: true
    twitterUrl?: true
    websiteUrl?: true
    githubUrl?: true
    avatarUrl?: true
    language?: true
    createdAt?: true
    updatedAt?: true
    avatarId?: true
    idProvider?: true
    resetPasswordExpires?: true
    theme?: true
    defaultCompanyId?: true
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
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
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
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string
    provider: $Enums.Provider
    password: string | null
    resetPasswordToken: string | null
    confirmationToken: string | null
    confirmed: boolean | null
    blocked: boolean | null
    phone: string | null
    firstName: string
    lastName: string | null
    position: string | null
    companyName: string | null
    country: string | null
    linkedinUrl: string | null
    twitterUrl: string | null
    websiteUrl: string | null
    githubUrl: string | null
    avatarUrl: string | null
    language: $Enums.Language
    createdAt: Date
    updatedAt: Date
    avatarId: string | null
    idProvider: string | null
    resetPasswordExpires: Date | null
    theme: $Enums.Theme
    defaultCompanyId: number | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
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
    email?: boolean
    provider?: boolean
    password?: boolean
    resetPasswordToken?: boolean
    confirmationToken?: boolean
    confirmed?: boolean
    blocked?: boolean
    phone?: boolean
    firstName?: boolean
    lastName?: boolean
    position?: boolean
    companyName?: boolean
    country?: boolean
    linkedinUrl?: boolean
    twitterUrl?: boolean
    websiteUrl?: boolean
    githubUrl?: boolean
    avatarUrl?: boolean
    language?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    avatarId?: boolean
    idProvider?: boolean
    resetPasswordExpires?: boolean
    theme?: boolean
    defaultCompanyId?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    companyMembers?: boolean | User$companyMembersArgs<ExtArgs>
    avatar?: boolean | User$avatarArgs<ExtArgs>
    company?: boolean | User$companyArgs<ExtArgs>
    files?: boolean | User$filesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    provider?: boolean
    password?: boolean
    resetPasswordToken?: boolean
    confirmationToken?: boolean
    confirmed?: boolean
    blocked?: boolean
    phone?: boolean
    firstName?: boolean
    lastName?: boolean
    position?: boolean
    companyName?: boolean
    country?: boolean
    linkedinUrl?: boolean
    twitterUrl?: boolean
    websiteUrl?: boolean
    githubUrl?: boolean
    avatarUrl?: boolean
    language?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    avatarId?: boolean
    idProvider?: boolean
    resetPasswordExpires?: boolean
    theme?: boolean
    defaultCompanyId?: boolean
    avatar?: boolean | User$avatarArgs<ExtArgs>
    company?: boolean | User$companyArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    provider?: boolean
    password?: boolean
    resetPasswordToken?: boolean
    confirmationToken?: boolean
    confirmed?: boolean
    blocked?: boolean
    phone?: boolean
    firstName?: boolean
    lastName?: boolean
    position?: boolean
    companyName?: boolean
    country?: boolean
    linkedinUrl?: boolean
    twitterUrl?: boolean
    websiteUrl?: boolean
    githubUrl?: boolean
    avatarUrl?: boolean
    language?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    avatarId?: boolean
    idProvider?: boolean
    resetPasswordExpires?: boolean
    theme?: boolean
    defaultCompanyId?: boolean
    avatar?: boolean | User$avatarArgs<ExtArgs>
    company?: boolean | User$companyArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    provider?: boolean
    password?: boolean
    resetPasswordToken?: boolean
    confirmationToken?: boolean
    confirmed?: boolean
    blocked?: boolean
    phone?: boolean
    firstName?: boolean
    lastName?: boolean
    position?: boolean
    companyName?: boolean
    country?: boolean
    linkedinUrl?: boolean
    twitterUrl?: boolean
    websiteUrl?: boolean
    githubUrl?: boolean
    avatarUrl?: boolean
    language?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    avatarId?: boolean
    idProvider?: boolean
    resetPasswordExpires?: boolean
    theme?: boolean
    defaultCompanyId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "provider" | "password" | "resetPasswordToken" | "confirmationToken" | "confirmed" | "blocked" | "phone" | "firstName" | "lastName" | "position" | "companyName" | "country" | "linkedinUrl" | "twitterUrl" | "websiteUrl" | "githubUrl" | "avatarUrl" | "language" | "createdAt" | "updatedAt" | "avatarId" | "idProvider" | "resetPasswordExpires" | "theme" | "defaultCompanyId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    companyMembers?: boolean | User$companyMembersArgs<ExtArgs>
    avatar?: boolean | User$avatarArgs<ExtArgs>
    company?: boolean | User$companyArgs<ExtArgs>
    files?: boolean | User$filesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    avatar?: boolean | User$avatarArgs<ExtArgs>
    company?: boolean | User$companyArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    avatar?: boolean | User$avatarArgs<ExtArgs>
    company?: boolean | User$companyArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      companyMembers: Prisma.$CompanyMemberPayload<ExtArgs>[]
      avatar: Prisma.$FilePayload<ExtArgs> | null
      company: Prisma.$CompanyPayload<ExtArgs> | null
      files: Prisma.$FilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      provider: $Enums.Provider
      password: string | null
      resetPasswordToken: string | null
      confirmationToken: string | null
      confirmed: boolean | null
      blocked: boolean | null
      phone: string | null
      firstName: string
      lastName: string | null
      position: string | null
      companyName: string | null
      country: string | null
      linkedinUrl: string | null
      twitterUrl: string | null
      websiteUrl: string | null
      githubUrl: string | null
      avatarUrl: string | null
      language: $Enums.Language
      createdAt: Date
      updatedAt: Date
      avatarId: string | null
      idProvider: string | null
      resetPasswordExpires: Date | null
      theme: $Enums.Theme
      defaultCompanyId: number | null
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
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    companyMembers<T extends User$companyMembersArgs<ExtArgs> = {}>(args?: Subset<T, User$companyMembersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    avatar<T extends User$avatarArgs<ExtArgs> = {}>(args?: Subset<T, User$avatarArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    company<T extends User$companyArgs<ExtArgs> = {}>(args?: Subset<T, User$companyArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    files<T extends User$filesArgs<ExtArgs> = {}>(args?: Subset<T, User$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly provider: FieldRef<"User", 'Provider'>
    readonly password: FieldRef<"User", 'String'>
    readonly resetPasswordToken: FieldRef<"User", 'String'>
    readonly confirmationToken: FieldRef<"User", 'String'>
    readonly confirmed: FieldRef<"User", 'Boolean'>
    readonly blocked: FieldRef<"User", 'Boolean'>
    readonly phone: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly position: FieldRef<"User", 'String'>
    readonly companyName: FieldRef<"User", 'String'>
    readonly country: FieldRef<"User", 'String'>
    readonly linkedinUrl: FieldRef<"User", 'String'>
    readonly twitterUrl: FieldRef<"User", 'String'>
    readonly websiteUrl: FieldRef<"User", 'String'>
    readonly githubUrl: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly language: FieldRef<"User", 'Language'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly avatarId: FieldRef<"User", 'String'>
    readonly idProvider: FieldRef<"User", 'String'>
    readonly resetPasswordExpires: FieldRef<"User", 'DateTime'>
    readonly theme: FieldRef<"User", 'Theme'>
    readonly defaultCompanyId: FieldRef<"User", 'Int'>
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
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.companyMembers
   */
  export type User$companyMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * User.avatar
   */
  export type User$avatarArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    where?: FileWhereInput
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
   * User.files
   */
  export type User$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    where?: FileWhereInput
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    cursor?: FileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
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
   * Model File
   */

  export type AggregateFile = {
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  export type FileAvgAggregateOutputType = {
    size: number | null
    userId: number | null
  }

  export type FileSumAggregateOutputType = {
    size: number | null
    userId: number | null
  }

  export type FileMinAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    publicId: string | null
    format: string | null
    version: string | null
    mimeType: string | null
    size: number | null
    userId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileMaxAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    publicId: string | null
    format: string | null
    version: string | null
    mimeType: string | null
    size: number | null
    userId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FileCountAggregateOutputType = {
    id: number
    name: number
    url: number
    publicId: number
    format: number
    version: number
    mimeType: number
    size: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FileAvgAggregateInputType = {
    size?: true
    userId?: true
  }

  export type FileSumAggregateInputType = {
    size?: true
    userId?: true
  }

  export type FileMinAggregateInputType = {
    id?: true
    name?: true
    url?: true
    publicId?: true
    format?: true
    version?: true
    mimeType?: true
    size?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileMaxAggregateInputType = {
    id?: true
    name?: true
    url?: true
    publicId?: true
    format?: true
    version?: true
    mimeType?: true
    size?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FileCountAggregateInputType = {
    id?: true
    name?: true
    url?: true
    publicId?: true
    format?: true
    version?: true
    mimeType?: true
    size?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which File to aggregate.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Files
    **/
    _count?: true | FileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileMaxAggregateInputType
  }

  export type GetFileAggregateType<T extends FileAggregateArgs> = {
        [P in keyof T & keyof AggregateFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFile[P]>
      : GetScalarType<T[P], AggregateFile[P]>
  }




  export type FileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileWhereInput
    orderBy?: FileOrderByWithAggregationInput | FileOrderByWithAggregationInput[]
    by: FileScalarFieldEnum[] | FileScalarFieldEnum
    having?: FileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileCountAggregateInputType | true
    _avg?: FileAvgAggregateInputType
    _sum?: FileSumAggregateInputType
    _min?: FileMinAggregateInputType
    _max?: FileMaxAggregateInputType
  }

  export type FileGroupByOutputType = {
    id: string
    name: string
    url: string
    publicId: string | null
    format: string | null
    version: string | null
    mimeType: string | null
    size: number | null
    userId: number | null
    createdAt: Date
    updatedAt: Date
    _count: FileCountAggregateOutputType | null
    _avg: FileAvgAggregateOutputType | null
    _sum: FileSumAggregateOutputType | null
    _min: FileMinAggregateOutputType | null
    _max: FileMaxAggregateOutputType | null
  }

  type GetFileGroupByPayload<T extends FileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileGroupByOutputType[P]>
            : GetScalarType<T[P], FileGroupByOutputType[P]>
        }
      >
    >


  export type FileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    publicId?: boolean
    format?: boolean
    version?: boolean
    mimeType?: boolean
    size?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    avatarFor?: boolean | File$avatarForArgs<ExtArgs>
    user?: boolean | File$userArgs<ExtArgs>
    _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>

  export type FileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    publicId?: boolean
    format?: boolean
    version?: boolean
    mimeType?: boolean
    size?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | File$userArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>

  export type FileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    publicId?: boolean
    format?: boolean
    version?: boolean
    mimeType?: boolean
    size?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | File$userArgs<ExtArgs>
  }, ExtArgs["result"]["file"]>

  export type FileSelectScalar = {
    id?: boolean
    name?: boolean
    url?: boolean
    publicId?: boolean
    format?: boolean
    version?: boolean
    mimeType?: boolean
    size?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "url" | "publicId" | "format" | "version" | "mimeType" | "size" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["file"]>
  export type FileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    avatarFor?: boolean | File$avatarForArgs<ExtArgs>
    user?: boolean | File$userArgs<ExtArgs>
    _count?: boolean | FileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | File$userArgs<ExtArgs>
  }
  export type FileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | File$userArgs<ExtArgs>
  }

  export type $FilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "File"
    objects: {
      avatarFor: Prisma.$UserPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      url: string
      publicId: string | null
      format: string | null
      version: string | null
      mimeType: string | null
      size: number | null
      userId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["file"]>
    composites: {}
  }

  type FileGetPayload<S extends boolean | null | undefined | FileDefaultArgs> = $Result.GetResult<Prisma.$FilePayload, S>

  type FileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FileCountAggregateInputType | true
    }

  export interface FileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['File'], meta: { name: 'File' } }
    /**
     * Find zero or one File that matches the filter.
     * @param {FileFindUniqueArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileFindUniqueArgs>(args: SelectSubset<T, FileFindUniqueArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one File that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FileFindUniqueOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileFindUniqueOrThrowArgs>(args: SelectSubset<T, FileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first File that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileFindFirstArgs>(args?: SelectSubset<T, FileFindFirstArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first File that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindFirstOrThrowArgs} args - Arguments to find a File
     * @example
     * // Get one File
     * const file = await prisma.file.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileFindFirstOrThrowArgs>(args?: SelectSubset<T, FileFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.file.findMany()
     * 
     * // Get first 10 Files
     * const files = await prisma.file.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileWithIdOnly = await prisma.file.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileFindManyArgs>(args?: SelectSubset<T, FileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a File.
     * @param {FileCreateArgs} args - Arguments to create a File.
     * @example
     * // Create one File
     * const File = await prisma.file.create({
     *   data: {
     *     // ... data to create a File
     *   }
     * })
     * 
     */
    create<T extends FileCreateArgs>(args: SelectSubset<T, FileCreateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Files.
     * @param {FileCreateManyArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const file = await prisma.file.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileCreateManyArgs>(args?: SelectSubset<T, FileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Files and returns the data saved in the database.
     * @param {FileCreateManyAndReturnArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const file = await prisma.file.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Files and only return the `id`
     * const fileWithIdOnly = await prisma.file.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileCreateManyAndReturnArgs>(args?: SelectSubset<T, FileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a File.
     * @param {FileDeleteArgs} args - Arguments to delete one File.
     * @example
     * // Delete one File
     * const File = await prisma.file.delete({
     *   where: {
     *     // ... filter to delete one File
     *   }
     * })
     * 
     */
    delete<T extends FileDeleteArgs>(args: SelectSubset<T, FileDeleteArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one File.
     * @param {FileUpdateArgs} args - Arguments to update one File.
     * @example
     * // Update one File
     * const file = await prisma.file.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileUpdateArgs>(args: SelectSubset<T, FileUpdateArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Files.
     * @param {FileDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.file.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileDeleteManyArgs>(args?: SelectSubset<T, FileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileUpdateManyArgs>(args: SelectSubset<T, FileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files and returns the data updated in the database.
     * @param {FileUpdateManyAndReturnArgs} args - Arguments to update many Files.
     * @example
     * // Update many Files
     * const file = await prisma.file.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Files and only return the `id`
     * const fileWithIdOnly = await prisma.file.updateManyAndReturn({
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
    updateManyAndReturn<T extends FileUpdateManyAndReturnArgs>(args: SelectSubset<T, FileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one File.
     * @param {FileUpsertArgs} args - Arguments to update or create a File.
     * @example
     * // Update or create a File
     * const file = await prisma.file.upsert({
     *   create: {
     *     // ... data to create a File
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the File we want to update
     *   }
     * })
     */
    upsert<T extends FileUpsertArgs>(args: SelectSubset<T, FileUpsertArgs<ExtArgs>>): Prisma__FileClient<$Result.GetResult<Prisma.$FilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.file.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
    **/
    count<T extends FileCountArgs>(
      args?: Subset<T, FileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FileAggregateArgs>(args: Subset<T, FileAggregateArgs>): Prisma.PrismaPromise<GetFileAggregateType<T>>

    /**
     * Group by File.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileGroupByArgs} args - Group by arguments.
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
      T extends FileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileGroupByArgs['orderBy'] }
        : { orderBy?: FileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the File model
   */
  readonly fields: FileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for File.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    avatarFor<T extends File$avatarForArgs<ExtArgs> = {}>(args?: Subset<T, File$avatarForArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends File$userArgs<ExtArgs> = {}>(args?: Subset<T, File$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the File model
   */
  interface FileFieldRefs {
    readonly id: FieldRef<"File", 'String'>
    readonly name: FieldRef<"File", 'String'>
    readonly url: FieldRef<"File", 'String'>
    readonly publicId: FieldRef<"File", 'String'>
    readonly format: FieldRef<"File", 'String'>
    readonly version: FieldRef<"File", 'String'>
    readonly mimeType: FieldRef<"File", 'String'>
    readonly size: FieldRef<"File", 'Int'>
    readonly userId: FieldRef<"File", 'Int'>
    readonly createdAt: FieldRef<"File", 'DateTime'>
    readonly updatedAt: FieldRef<"File", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * File findUnique
   */
  export type FileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findUniqueOrThrow
   */
  export type FileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File findFirst
   */
  export type FileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findFirstOrThrow
   */
  export type FileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which File to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File findMany
   */
  export type FileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FileOrderByWithRelationInput | FileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Files.
     */
    cursor?: FileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    distinct?: FileScalarFieldEnum | FileScalarFieldEnum[]
  }

  /**
   * File create
   */
  export type FileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to create a File.
     */
    data: XOR<FileCreateInput, FileUncheckedCreateInput>
  }

  /**
   * File createMany
   */
  export type FileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * File createManyAndReturn
   */
  export type FileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * The data used to create many Files.
     */
    data: FileCreateManyInput | FileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * File update
   */
  export type FileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The data needed to update a File.
     */
    data: XOR<FileUpdateInput, FileUncheckedUpdateInput>
    /**
     * Choose, which File to update.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File updateMany
   */
  export type FileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to update.
     */
    limit?: number
  }

  /**
   * File updateManyAndReturn
   */
  export type FileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * The data used to update Files.
     */
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * File upsert
   */
  export type FileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * The filter to search for the File to update in case it exists.
     */
    where: FileWhereUniqueInput
    /**
     * In case the File found by the `where` argument doesn't exist, create a new File with this data.
     */
    create: XOR<FileCreateInput, FileUncheckedCreateInput>
    /**
     * In case the File was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileUpdateInput, FileUncheckedUpdateInput>
  }

  /**
   * File delete
   */
  export type FileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
    /**
     * Filter which File to delete.
     */
    where: FileWhereUniqueInput
  }

  /**
   * File deleteMany
   */
  export type FileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Files to delete
     */
    where?: FileWhereInput
    /**
     * Limit how many Files to delete.
     */
    limit?: number
  }

  /**
   * File.avatarFor
   */
  export type File$avatarForArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * File.user
   */
  export type File$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * File without action
   */
  export type FileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the File
     */
    select?: FileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the File
     */
    omit?: FileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FileInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    userId: number | null
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    userId: number | null
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: number | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    userId?: true
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    userId?: true
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: number
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
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
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
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
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'Int'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionAvgAggregateOutputType = {
    userId: number | null
  }

  export type SessionSumAggregateOutputType = {
    userId: number | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: number | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: number | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionAvgAggregateInputType = {
    userId?: true
  }

  export type SessionSumAggregateInputType = {
    userId?: true
  }

  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _avg?: SessionAvgAggregateInputType
    _sum?: SessionSumAggregateInputType
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: number
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: number
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
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
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
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
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'Int'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
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
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
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
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _avg: CompanyAvgAggregateOutputType | null
    _sum: CompanySumAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyAvgAggregateOutputType = {
    id: number | null
  }

  export type CompanySumAggregateOutputType = {
    id: number | null
  }

  export type CompanyMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    tokenApi: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    tokenApi: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CompanyCountAggregateOutputType = {
    id: number
    name: number
    description: number
    tokenApi: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CompanyAvgAggregateInputType = {
    id?: true
  }

  export type CompanySumAggregateInputType = {
    id?: true
  }

  export type CompanyMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    tokenApi?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    tokenApi?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CompanyCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    tokenApi?: true
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
     * Select which fields to average
    **/
    _avg?: CompanyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompanySumAggregateInputType
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
    _avg?: CompanyAvgAggregateInputType
    _sum?: CompanySumAggregateInputType
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    id: number
    name: string
    description: string | null
    tokenApi: string | null
    createdAt: Date
    updatedAt: Date
    _count: CompanyCountAggregateOutputType | null
    _avg: CompanyAvgAggregateOutputType | null
    _sum: CompanySumAggregateOutputType | null
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
    description?: boolean
    tokenApi?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    members?: boolean | Company$membersArgs<ExtArgs>
    user?: boolean | Company$userArgs<ExtArgs>
    CustomerSubscription?: boolean | Company$CustomerSubscriptionArgs<ExtArgs>
    UsageTracking?: boolean | Company$UsageTrackingArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    tokenApi?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    tokenApi?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    tokenApi?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "tokenApi" | "createdAt" | "updatedAt", ExtArgs["result"]["company"]>
  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Company$membersArgs<ExtArgs>
    user?: boolean | Company$userArgs<ExtArgs>
    CustomerSubscription?: boolean | Company$CustomerSubscriptionArgs<ExtArgs>
    UsageTracking?: boolean | Company$UsageTrackingArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CompanyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      members: Prisma.$CompanyMemberPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>[]
      CustomerSubscription: Prisma.$CustomerSubscriptionPayload<ExtArgs>[]
      UsageTracking: Prisma.$UsageTrackingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string | null
      tokenApi: string | null
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
    members<T extends Company$membersArgs<ExtArgs> = {}>(args?: Subset<T, Company$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends Company$userArgs<ExtArgs> = {}>(args?: Subset<T, Company$userArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    CustomerSubscription<T extends Company$CustomerSubscriptionArgs<ExtArgs> = {}>(args?: Subset<T, Company$CustomerSubscriptionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    UsageTracking<T extends Company$UsageTrackingArgs<ExtArgs> = {}>(args?: Subset<T, Company$UsageTrackingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly id: FieldRef<"Company", 'Int'>
    readonly name: FieldRef<"Company", 'String'>
    readonly description: FieldRef<"Company", 'String'>
    readonly tokenApi: FieldRef<"Company", 'String'>
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
   * Company.user
   */
  export type Company$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Company.CustomerSubscription
   */
  export type Company$CustomerSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    where?: CustomerSubscriptionWhereInput
    orderBy?: CustomerSubscriptionOrderByWithRelationInput | CustomerSubscriptionOrderByWithRelationInput[]
    cursor?: CustomerSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerSubscriptionScalarFieldEnum | CustomerSubscriptionScalarFieldEnum[]
  }

  /**
   * Company.UsageTracking
   */
  export type Company$UsageTrackingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    where?: UsageTrackingWhereInput
    orderBy?: UsageTrackingOrderByWithRelationInput | UsageTrackingOrderByWithRelationInput[]
    cursor?: UsageTrackingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsageTrackingScalarFieldEnum | UsageTrackingScalarFieldEnum[]
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
    _avg: CompanyMemberAvgAggregateOutputType | null
    _sum: CompanyMemberSumAggregateOutputType | null
    _min: CompanyMemberMinAggregateOutputType | null
    _max: CompanyMemberMaxAggregateOutputType | null
  }

  export type CompanyMemberAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    companyId: number | null
  }

  export type CompanyMemberSumAggregateOutputType = {
    id: number | null
    userId: number | null
    companyId: number | null
  }

  export type CompanyMemberMinAggregateOutputType = {
    id: number | null
    isAdmin: boolean | null
    canPost: boolean | null
    canApprove: boolean | null
    isOwner: boolean | null
    companyMemberStatus: $Enums.CompanyMemberStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: number | null
    companyId: number | null
  }

  export type CompanyMemberMaxAggregateOutputType = {
    id: number | null
    isAdmin: boolean | null
    canPost: boolean | null
    canApprove: boolean | null
    isOwner: boolean | null
    companyMemberStatus: $Enums.CompanyMemberStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: number | null
    companyId: number | null
  }

  export type CompanyMemberCountAggregateOutputType = {
    id: number
    isAdmin: number
    canPost: number
    canApprove: number
    isOwner: number
    companyMemberStatus: number
    createdAt: number
    updatedAt: number
    userId: number
    companyId: number
    _all: number
  }


  export type CompanyMemberAvgAggregateInputType = {
    id?: true
    userId?: true
    companyId?: true
  }

  export type CompanyMemberSumAggregateInputType = {
    id?: true
    userId?: true
    companyId?: true
  }

  export type CompanyMemberMinAggregateInputType = {
    id?: true
    isAdmin?: true
    canPost?: true
    canApprove?: true
    isOwner?: true
    companyMemberStatus?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    companyId?: true
  }

  export type CompanyMemberMaxAggregateInputType = {
    id?: true
    isAdmin?: true
    canPost?: true
    canApprove?: true
    isOwner?: true
    companyMemberStatus?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    companyId?: true
  }

  export type CompanyMemberCountAggregateInputType = {
    id?: true
    isAdmin?: true
    canPost?: true
    canApprove?: true
    isOwner?: true
    companyMemberStatus?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    companyId?: true
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
     * Select which fields to average
    **/
    _avg?: CompanyMemberAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompanyMemberSumAggregateInputType
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
    _avg?: CompanyMemberAvgAggregateInputType
    _sum?: CompanyMemberSumAggregateInputType
    _min?: CompanyMemberMinAggregateInputType
    _max?: CompanyMemberMaxAggregateInputType
  }

  export type CompanyMemberGroupByOutputType = {
    id: number
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt: Date
    updatedAt: Date
    userId: number
    companyId: number
    _count: CompanyMemberCountAggregateOutputType | null
    _avg: CompanyMemberAvgAggregateOutputType | null
    _sum: CompanyMemberSumAggregateOutputType | null
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
    isAdmin?: boolean
    canPost?: boolean
    canApprove?: boolean
    isOwner?: boolean
    companyMemberStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    companyId?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyMember"]>

  export type CompanyMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    isAdmin?: boolean
    canPost?: boolean
    canApprove?: boolean
    isOwner?: boolean
    companyMemberStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    companyId?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyMember"]>

  export type CompanyMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    isAdmin?: boolean
    canPost?: boolean
    canApprove?: boolean
    isOwner?: boolean
    companyMemberStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    companyId?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["companyMember"]>

  export type CompanyMemberSelectScalar = {
    id?: boolean
    isAdmin?: boolean
    canPost?: boolean
    canApprove?: boolean
    isOwner?: boolean
    companyMemberStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    companyId?: boolean
  }

  export type CompanyMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "isAdmin" | "canPost" | "canApprove" | "isOwner" | "companyMemberStatus" | "createdAt" | "updatedAt" | "userId" | "companyId", ExtArgs["result"]["companyMember"]>
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
      id: number
      isAdmin: boolean
      canPost: boolean
      canApprove: boolean
      isOwner: boolean
      companyMemberStatus: $Enums.CompanyMemberStatus
      createdAt: Date
      updatedAt: Date
      userId: number
      companyId: number
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
    readonly id: FieldRef<"CompanyMember", 'Int'>
    readonly isAdmin: FieldRef<"CompanyMember", 'Boolean'>
    readonly canPost: FieldRef<"CompanyMember", 'Boolean'>
    readonly canApprove: FieldRef<"CompanyMember", 'Boolean'>
    readonly isOwner: FieldRef<"CompanyMember", 'Boolean'>
    readonly companyMemberStatus: FieldRef<"CompanyMember", 'CompanyMemberStatus'>
    readonly createdAt: FieldRef<"CompanyMember", 'DateTime'>
    readonly updatedAt: FieldRef<"CompanyMember", 'DateTime'>
    readonly userId: FieldRef<"CompanyMember", 'Int'>
    readonly companyId: FieldRef<"CompanyMember", 'Int'>
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
   * Model SubscriptionPlan
   */

  export type AggregateSubscriptionPlan = {
    _count: SubscriptionPlanCountAggregateOutputType | null
    _avg: SubscriptionPlanAvgAggregateOutputType | null
    _sum: SubscriptionPlanSumAggregateOutputType | null
    _min: SubscriptionPlanMinAggregateOutputType | null
    _max: SubscriptionPlanMaxAggregateOutputType | null
  }

  export type SubscriptionPlanAvgAggregateOutputType = {
    priceMonthly: Decimal | null
    priceYearly: Decimal | null
  }

  export type SubscriptionPlanSumAggregateOutputType = {
    priceMonthly: Decimal | null
    priceYearly: Decimal | null
  }

  export type SubscriptionPlanMinAggregateOutputType = {
    id: string | null
    planType: $Enums.PlanType | null
    stripeProductId: string | null
    stripePriceIdMonthly: string | null
    stripePriceIdYearly: string | null
    priceMonthly: Decimal | null
    priceYearly: Decimal | null
    currency: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionPlanMaxAggregateOutputType = {
    id: string | null
    planType: $Enums.PlanType | null
    stripeProductId: string | null
    stripePriceIdMonthly: string | null
    stripePriceIdYearly: string | null
    priceMonthly: Decimal | null
    priceYearly: Decimal | null
    currency: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionPlanCountAggregateOutputType = {
    id: number
    planType: number
    stripeProductId: number
    stripePriceIdMonthly: number
    stripePriceIdYearly: number
    priceMonthly: number
    priceYearly: number
    currency: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionPlanAvgAggregateInputType = {
    priceMonthly?: true
    priceYearly?: true
  }

  export type SubscriptionPlanSumAggregateInputType = {
    priceMonthly?: true
    priceYearly?: true
  }

  export type SubscriptionPlanMinAggregateInputType = {
    id?: true
    planType?: true
    stripeProductId?: true
    stripePriceIdMonthly?: true
    stripePriceIdYearly?: true
    priceMonthly?: true
    priceYearly?: true
    currency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionPlanMaxAggregateInputType = {
    id?: true
    planType?: true
    stripeProductId?: true
    stripePriceIdMonthly?: true
    stripePriceIdYearly?: true
    priceMonthly?: true
    priceYearly?: true
    currency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionPlanCountAggregateInputType = {
    id?: true
    planType?: true
    stripeProductId?: true
    stripePriceIdMonthly?: true
    stripePriceIdYearly?: true
    priceMonthly?: true
    priceYearly?: true
    currency?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubscriptionPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlan to aggregate.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionPlans
    **/
    _count?: true | SubscriptionPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SubscriptionPlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SubscriptionPlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionPlanMaxAggregateInputType
  }

  export type GetSubscriptionPlanAggregateType<T extends SubscriptionPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionPlan[P]>
      : GetScalarType<T[P], AggregateSubscriptionPlan[P]>
  }




  export type SubscriptionPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionPlanWhereInput
    orderBy?: SubscriptionPlanOrderByWithAggregationInput | SubscriptionPlanOrderByWithAggregationInput[]
    by: SubscriptionPlanScalarFieldEnum[] | SubscriptionPlanScalarFieldEnum
    having?: SubscriptionPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionPlanCountAggregateInputType | true
    _avg?: SubscriptionPlanAvgAggregateInputType
    _sum?: SubscriptionPlanSumAggregateInputType
    _min?: SubscriptionPlanMinAggregateInputType
    _max?: SubscriptionPlanMaxAggregateInputType
  }

  export type SubscriptionPlanGroupByOutputType = {
    id: string
    planType: $Enums.PlanType
    stripeProductId: string | null
    stripePriceIdMonthly: string | null
    stripePriceIdYearly: string | null
    priceMonthly: Decimal
    priceYearly: Decimal
    currency: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionPlanCountAggregateOutputType | null
    _avg: SubscriptionPlanAvgAggregateOutputType | null
    _sum: SubscriptionPlanSumAggregateOutputType | null
    _min: SubscriptionPlanMinAggregateOutputType | null
    _max: SubscriptionPlanMaxAggregateOutputType | null
  }

  type GetSubscriptionPlanGroupByPayload<T extends SubscriptionPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionPlanGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionPlanGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    planType?: boolean
    stripeProductId?: boolean
    stripePriceIdMonthly?: boolean
    stripePriceIdYearly?: boolean
    priceMonthly?: boolean
    priceYearly?: boolean
    currency?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    subscriptions?: boolean | SubscriptionPlan$subscriptionsArgs<ExtArgs>
    _count?: boolean | SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscriptionPlan"]>

  export type SubscriptionPlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    planType?: boolean
    stripeProductId?: boolean
    stripePriceIdMonthly?: boolean
    stripePriceIdYearly?: boolean
    priceMonthly?: boolean
    priceYearly?: boolean
    currency?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscriptionPlan"]>

  export type SubscriptionPlanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    planType?: boolean
    stripeProductId?: boolean
    stripePriceIdMonthly?: boolean
    stripePriceIdYearly?: boolean
    priceMonthly?: boolean
    priceYearly?: boolean
    currency?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscriptionPlan"]>

  export type SubscriptionPlanSelectScalar = {
    id?: boolean
    planType?: boolean
    stripeProductId?: boolean
    stripePriceIdMonthly?: boolean
    stripePriceIdYearly?: boolean
    priceMonthly?: boolean
    priceYearly?: boolean
    currency?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionPlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "planType" | "stripeProductId" | "stripePriceIdMonthly" | "stripePriceIdYearly" | "priceMonthly" | "priceYearly" | "currency" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["subscriptionPlan"]>
  export type SubscriptionPlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | SubscriptionPlan$subscriptionsArgs<ExtArgs>
    _count?: boolean | SubscriptionPlanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SubscriptionPlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SubscriptionPlanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SubscriptionPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubscriptionPlan"
    objects: {
      subscriptions: Prisma.$CustomerSubscriptionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      planType: $Enums.PlanType
      stripeProductId: string | null
      stripePriceIdMonthly: string | null
      stripePriceIdYearly: string | null
      priceMonthly: Prisma.Decimal
      priceYearly: Prisma.Decimal
      currency: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subscriptionPlan"]>
    composites: {}
  }

  type SubscriptionPlanGetPayload<S extends boolean | null | undefined | SubscriptionPlanDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPlanPayload, S>

  type SubscriptionPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionPlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionPlanCountAggregateInputType | true
    }

  export interface SubscriptionPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionPlan'], meta: { name: 'SubscriptionPlan' } }
    /**
     * Find zero or one SubscriptionPlan that matches the filter.
     * @param {SubscriptionPlanFindUniqueArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionPlanFindUniqueArgs>(args: SelectSubset<T, SubscriptionPlanFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubscriptionPlan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionPlanFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionPlanFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindFirstArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionPlanFindFirstArgs>(args?: SelectSubset<T, SubscriptionPlanFindFirstArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindFirstOrThrowArgs} args - Arguments to find a SubscriptionPlan
     * @example
     * // Get one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionPlanFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubscriptionPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionPlans
     * const subscriptionPlans = await prisma.subscriptionPlan.findMany()
     * 
     * // Get first 10 SubscriptionPlans
     * const subscriptionPlans = await prisma.subscriptionPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionPlanWithIdOnly = await prisma.subscriptionPlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionPlanFindManyArgs>(args?: SelectSubset<T, SubscriptionPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubscriptionPlan.
     * @param {SubscriptionPlanCreateArgs} args - Arguments to create a SubscriptionPlan.
     * @example
     * // Create one SubscriptionPlan
     * const SubscriptionPlan = await prisma.subscriptionPlan.create({
     *   data: {
     *     // ... data to create a SubscriptionPlan
     *   }
     * })
     * 
     */
    create<T extends SubscriptionPlanCreateArgs>(args: SelectSubset<T, SubscriptionPlanCreateArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubscriptionPlans.
     * @param {SubscriptionPlanCreateManyArgs} args - Arguments to create many SubscriptionPlans.
     * @example
     * // Create many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionPlanCreateManyArgs>(args?: SelectSubset<T, SubscriptionPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubscriptionPlans and returns the data saved in the database.
     * @param {SubscriptionPlanCreateManyAndReturnArgs} args - Arguments to create many SubscriptionPlans.
     * @example
     * // Create many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubscriptionPlans and only return the `id`
     * const subscriptionPlanWithIdOnly = await prisma.subscriptionPlan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionPlanCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubscriptionPlan.
     * @param {SubscriptionPlanDeleteArgs} args - Arguments to delete one SubscriptionPlan.
     * @example
     * // Delete one SubscriptionPlan
     * const SubscriptionPlan = await prisma.subscriptionPlan.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionPlan
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionPlanDeleteArgs>(args: SelectSubset<T, SubscriptionPlanDeleteArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubscriptionPlan.
     * @param {SubscriptionPlanUpdateArgs} args - Arguments to update one SubscriptionPlan.
     * @example
     * // Update one SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionPlanUpdateArgs>(args: SelectSubset<T, SubscriptionPlanUpdateArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubscriptionPlans.
     * @param {SubscriptionPlanDeleteManyArgs} args - Arguments to filter SubscriptionPlans to delete.
     * @example
     * // Delete a few SubscriptionPlans
     * const { count } = await prisma.subscriptionPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionPlanDeleteManyArgs>(args?: SelectSubset<T, SubscriptionPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionPlanUpdateManyArgs>(args: SelectSubset<T, SubscriptionPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionPlans and returns the data updated in the database.
     * @param {SubscriptionPlanUpdateManyAndReturnArgs} args - Arguments to update many SubscriptionPlans.
     * @example
     * // Update many SubscriptionPlans
     * const subscriptionPlan = await prisma.subscriptionPlan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubscriptionPlans and only return the `id`
     * const subscriptionPlanWithIdOnly = await prisma.subscriptionPlan.updateManyAndReturn({
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
    updateManyAndReturn<T extends SubscriptionPlanUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionPlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubscriptionPlan.
     * @param {SubscriptionPlanUpsertArgs} args - Arguments to update or create a SubscriptionPlan.
     * @example
     * // Update or create a SubscriptionPlan
     * const subscriptionPlan = await prisma.subscriptionPlan.upsert({
     *   create: {
     *     // ... data to create a SubscriptionPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionPlan we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionPlanUpsertArgs>(args: SelectSubset<T, SubscriptionPlanUpsertArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubscriptionPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanCountArgs} args - Arguments to filter SubscriptionPlans to count.
     * @example
     * // Count the number of SubscriptionPlans
     * const count = await prisma.subscriptionPlan.count({
     *   where: {
     *     // ... the filter for the SubscriptionPlans we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionPlanCountArgs>(
      args?: Subset<T, SubscriptionPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SubscriptionPlanAggregateArgs>(args: Subset<T, SubscriptionPlanAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionPlanAggregateType<T>>

    /**
     * Group by SubscriptionPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanGroupByArgs} args - Group by arguments.
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
      T extends SubscriptionPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionPlanGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionPlanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SubscriptionPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubscriptionPlan model
   */
  readonly fields: SubscriptionPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionPlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscriptions<T extends SubscriptionPlan$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlan$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the SubscriptionPlan model
   */
  interface SubscriptionPlanFieldRefs {
    readonly id: FieldRef<"SubscriptionPlan", 'String'>
    readonly planType: FieldRef<"SubscriptionPlan", 'PlanType'>
    readonly stripeProductId: FieldRef<"SubscriptionPlan", 'String'>
    readonly stripePriceIdMonthly: FieldRef<"SubscriptionPlan", 'String'>
    readonly stripePriceIdYearly: FieldRef<"SubscriptionPlan", 'String'>
    readonly priceMonthly: FieldRef<"SubscriptionPlan", 'Decimal'>
    readonly priceYearly: FieldRef<"SubscriptionPlan", 'Decimal'>
    readonly currency: FieldRef<"SubscriptionPlan", 'String'>
    readonly isActive: FieldRef<"SubscriptionPlan", 'Boolean'>
    readonly createdAt: FieldRef<"SubscriptionPlan", 'DateTime'>
    readonly updatedAt: FieldRef<"SubscriptionPlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubscriptionPlan findUnique
   */
  export type SubscriptionPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan findUniqueOrThrow
   */
  export type SubscriptionPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan findFirst
   */
  export type SubscriptionPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPlans.
     */
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan findFirstOrThrow
   */
  export type SubscriptionPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlan to fetch.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionPlans.
     */
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan findMany
   */
  export type SubscriptionPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter, which SubscriptionPlans to fetch.
     */
    where?: SubscriptionPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionPlans to fetch.
     */
    orderBy?: SubscriptionPlanOrderByWithRelationInput | SubscriptionPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionPlans.
     */
    cursor?: SubscriptionPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionPlans.
     */
    skip?: number
    distinct?: SubscriptionPlanScalarFieldEnum | SubscriptionPlanScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan create
   */
  export type SubscriptionPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionPlan.
     */
    data: XOR<SubscriptionPlanCreateInput, SubscriptionPlanUncheckedCreateInput>
  }

  /**
   * SubscriptionPlan createMany
   */
  export type SubscriptionPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionPlans.
     */
    data: SubscriptionPlanCreateManyInput | SubscriptionPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionPlan createManyAndReturn
   */
  export type SubscriptionPlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * The data used to create many SubscriptionPlans.
     */
    data: SubscriptionPlanCreateManyInput | SubscriptionPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionPlan update
   */
  export type SubscriptionPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionPlan.
     */
    data: XOR<SubscriptionPlanUpdateInput, SubscriptionPlanUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionPlan to update.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan updateMany
   */
  export type SubscriptionPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionPlans.
     */
    data: XOR<SubscriptionPlanUpdateManyMutationInput, SubscriptionPlanUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPlans to update
     */
    where?: SubscriptionPlanWhereInput
    /**
     * Limit how many SubscriptionPlans to update.
     */
    limit?: number
  }

  /**
   * SubscriptionPlan updateManyAndReturn
   */
  export type SubscriptionPlanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * The data used to update SubscriptionPlans.
     */
    data: XOR<SubscriptionPlanUpdateManyMutationInput, SubscriptionPlanUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionPlans to update
     */
    where?: SubscriptionPlanWhereInput
    /**
     * Limit how many SubscriptionPlans to update.
     */
    limit?: number
  }

  /**
   * SubscriptionPlan upsert
   */
  export type SubscriptionPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionPlan to update in case it exists.
     */
    where: SubscriptionPlanWhereUniqueInput
    /**
     * In case the SubscriptionPlan found by the `where` argument doesn't exist, create a new SubscriptionPlan with this data.
     */
    create: XOR<SubscriptionPlanCreateInput, SubscriptionPlanUncheckedCreateInput>
    /**
     * In case the SubscriptionPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionPlanUpdateInput, SubscriptionPlanUncheckedUpdateInput>
  }

  /**
   * SubscriptionPlan delete
   */
  export type SubscriptionPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
    /**
     * Filter which SubscriptionPlan to delete.
     */
    where: SubscriptionPlanWhereUniqueInput
  }

  /**
   * SubscriptionPlan deleteMany
   */
  export type SubscriptionPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlans to delete
     */
    where?: SubscriptionPlanWhereInput
    /**
     * Limit how many SubscriptionPlans to delete.
     */
    limit?: number
  }

  /**
   * SubscriptionPlan.subscriptions
   */
  export type SubscriptionPlan$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    where?: CustomerSubscriptionWhereInput
    orderBy?: CustomerSubscriptionOrderByWithRelationInput | CustomerSubscriptionOrderByWithRelationInput[]
    cursor?: CustomerSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerSubscriptionScalarFieldEnum | CustomerSubscriptionScalarFieldEnum[]
  }

  /**
   * SubscriptionPlan without action
   */
  export type SubscriptionPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlan
     */
    select?: SubscriptionPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionPlan
     */
    omit?: SubscriptionPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionPlanInclude<ExtArgs> | null
  }


  /**
   * Model CustomerSubscription
   */

  export type AggregateCustomerSubscription = {
    _count: CustomerSubscriptionCountAggregateOutputType | null
    _avg: CustomerSubscriptionAvgAggregateOutputType | null
    _sum: CustomerSubscriptionSumAggregateOutputType | null
    _min: CustomerSubscriptionMinAggregateOutputType | null
    _max: CustomerSubscriptionMaxAggregateOutputType | null
  }

  export type CustomerSubscriptionAvgAggregateOutputType = {
    companyId: number | null
  }

  export type CustomerSubscriptionSumAggregateOutputType = {
    companyId: number | null
  }

  export type CustomerSubscriptionMinAggregateOutputType = {
    id: string | null
    companyId: number | null
    planId: string | null
    status: $Enums.SubscriptionStatus | null
    billingInterval: $Enums.BillingInterval | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    cancellationDetails: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    trialStart: Date | null
    trialEnd: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerSubscriptionMaxAggregateOutputType = {
    id: string | null
    companyId: number | null
    planId: string | null
    status: $Enums.SubscriptionStatus | null
    billingInterval: $Enums.BillingInterval | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    cancellationDetails: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean | null
    trialStart: Date | null
    trialEnd: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomerSubscriptionCountAggregateOutputType = {
    id: number
    companyId: number
    planId: number
    status: number
    billingInterval: number
    stripeCustomerId: number
    stripeSubscriptionId: number
    cancellationDetails: number
    currentPeriodStart: number
    currentPeriodEnd: number
    cancelAtPeriodEnd: number
    trialStart: number
    trialEnd: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomerSubscriptionAvgAggregateInputType = {
    companyId?: true
  }

  export type CustomerSubscriptionSumAggregateInputType = {
    companyId?: true
  }

  export type CustomerSubscriptionMinAggregateInputType = {
    id?: true
    companyId?: true
    planId?: true
    status?: true
    billingInterval?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    cancellationDetails?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    trialStart?: true
    trialEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerSubscriptionMaxAggregateInputType = {
    id?: true
    companyId?: true
    planId?: true
    status?: true
    billingInterval?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    cancellationDetails?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    trialStart?: true
    trialEnd?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomerSubscriptionCountAggregateInputType = {
    id?: true
    companyId?: true
    planId?: true
    status?: true
    billingInterval?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    cancellationDetails?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    cancelAtPeriodEnd?: true
    trialStart?: true
    trialEnd?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomerSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerSubscription to aggregate.
     */
    where?: CustomerSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerSubscriptions to fetch.
     */
    orderBy?: CustomerSubscriptionOrderByWithRelationInput | CustomerSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomerSubscriptions
    **/
    _count?: true | CustomerSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerSubscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerSubscriptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerSubscriptionMaxAggregateInputType
  }

  export type GetCustomerSubscriptionAggregateType<T extends CustomerSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomerSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomerSubscription[P]>
      : GetScalarType<T[P], AggregateCustomerSubscription[P]>
  }




  export type CustomerSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerSubscriptionWhereInput
    orderBy?: CustomerSubscriptionOrderByWithAggregationInput | CustomerSubscriptionOrderByWithAggregationInput[]
    by: CustomerSubscriptionScalarFieldEnum[] | CustomerSubscriptionScalarFieldEnum
    having?: CustomerSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerSubscriptionCountAggregateInputType | true
    _avg?: CustomerSubscriptionAvgAggregateInputType
    _sum?: CustomerSubscriptionSumAggregateInputType
    _min?: CustomerSubscriptionMinAggregateInputType
    _max?: CustomerSubscriptionMaxAggregateInputType
  }

  export type CustomerSubscriptionGroupByOutputType = {
    id: string
    companyId: number
    planId: string
    status: $Enums.SubscriptionStatus
    billingInterval: $Enums.BillingInterval
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    cancellationDetails: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    trialStart: Date | null
    trialEnd: Date | null
    createdAt: Date
    updatedAt: Date
    _count: CustomerSubscriptionCountAggregateOutputType | null
    _avg: CustomerSubscriptionAvgAggregateOutputType | null
    _sum: CustomerSubscriptionSumAggregateOutputType | null
    _min: CustomerSubscriptionMinAggregateOutputType | null
    _max: CustomerSubscriptionMaxAggregateOutputType | null
  }

  type GetCustomerSubscriptionGroupByPayload<T extends CustomerSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    planId?: boolean
    status?: boolean
    billingInterval?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    cancellationDetails?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    trialStart?: boolean
    trialEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    usageTracking?: boolean | CustomerSubscription$usageTrackingArgs<ExtArgs>
    _count?: boolean | CustomerSubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customerSubscription"]>

  export type CustomerSubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    planId?: boolean
    status?: boolean
    billingInterval?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    cancellationDetails?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    trialStart?: boolean
    trialEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customerSubscription"]>

  export type CustomerSubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    planId?: boolean
    status?: boolean
    billingInterval?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    cancellationDetails?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    trialStart?: boolean
    trialEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customerSubscription"]>

  export type CustomerSubscriptionSelectScalar = {
    id?: boolean
    companyId?: boolean
    planId?: boolean
    status?: boolean
    billingInterval?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    cancellationDetails?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    cancelAtPeriodEnd?: boolean
    trialStart?: boolean
    trialEnd?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CustomerSubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyId" | "planId" | "status" | "billingInterval" | "stripeCustomerId" | "stripeSubscriptionId" | "cancellationDetails" | "currentPeriodStart" | "currentPeriodEnd" | "cancelAtPeriodEnd" | "trialStart" | "trialEnd" | "createdAt" | "updatedAt", ExtArgs["result"]["customerSubscription"]>
  export type CustomerSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
    usageTracking?: boolean | CustomerSubscription$usageTrackingArgs<ExtArgs>
    _count?: boolean | CustomerSubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerSubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }
  export type CustomerSubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    plan?: boolean | SubscriptionPlanDefaultArgs<ExtArgs>
  }

  export type $CustomerSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomerSubscription"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      plan: Prisma.$SubscriptionPlanPayload<ExtArgs>
      usageTracking: Prisma.$UsageTrackingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyId: number
      planId: string
      status: $Enums.SubscriptionStatus
      billingInterval: $Enums.BillingInterval
      stripeCustomerId: string | null
      stripeSubscriptionId: string | null
      cancellationDetails: string | null
      currentPeriodStart: Date | null
      currentPeriodEnd: Date | null
      cancelAtPeriodEnd: boolean
      trialStart: Date | null
      trialEnd: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customerSubscription"]>
    composites: {}
  }

  type CustomerSubscriptionGetPayload<S extends boolean | null | undefined | CustomerSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$CustomerSubscriptionPayload, S>

  type CustomerSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerSubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerSubscriptionCountAggregateInputType | true
    }

  export interface CustomerSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomerSubscription'], meta: { name: 'CustomerSubscription' } }
    /**
     * Find zero or one CustomerSubscription that matches the filter.
     * @param {CustomerSubscriptionFindUniqueArgs} args - Arguments to find a CustomerSubscription
     * @example
     * // Get one CustomerSubscription
     * const customerSubscription = await prisma.customerSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerSubscriptionFindUniqueArgs>(args: SelectSubset<T, CustomerSubscriptionFindUniqueArgs<ExtArgs>>): Prisma__CustomerSubscriptionClient<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomerSubscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a CustomerSubscription
     * @example
     * // Get one CustomerSubscription
     * const customerSubscription = await prisma.customerSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerSubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerSubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerSubscriptionClient<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerSubscriptionFindFirstArgs} args - Arguments to find a CustomerSubscription
     * @example
     * // Get one CustomerSubscription
     * const customerSubscription = await prisma.customerSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerSubscriptionFindFirstArgs>(args?: SelectSubset<T, CustomerSubscriptionFindFirstArgs<ExtArgs>>): Prisma__CustomerSubscriptionClient<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerSubscriptionFindFirstOrThrowArgs} args - Arguments to find a CustomerSubscription
     * @example
     * // Get one CustomerSubscription
     * const customerSubscription = await prisma.customerSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerSubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerSubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerSubscriptionClient<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomerSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomerSubscriptions
     * const customerSubscriptions = await prisma.customerSubscription.findMany()
     * 
     * // Get first 10 CustomerSubscriptions
     * const customerSubscriptions = await prisma.customerSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerSubscriptionWithIdOnly = await prisma.customerSubscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerSubscriptionFindManyArgs>(args?: SelectSubset<T, CustomerSubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomerSubscription.
     * @param {CustomerSubscriptionCreateArgs} args - Arguments to create a CustomerSubscription.
     * @example
     * // Create one CustomerSubscription
     * const CustomerSubscription = await prisma.customerSubscription.create({
     *   data: {
     *     // ... data to create a CustomerSubscription
     *   }
     * })
     * 
     */
    create<T extends CustomerSubscriptionCreateArgs>(args: SelectSubset<T, CustomerSubscriptionCreateArgs<ExtArgs>>): Prisma__CustomerSubscriptionClient<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomerSubscriptions.
     * @param {CustomerSubscriptionCreateManyArgs} args - Arguments to create many CustomerSubscriptions.
     * @example
     * // Create many CustomerSubscriptions
     * const customerSubscription = await prisma.customerSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerSubscriptionCreateManyArgs>(args?: SelectSubset<T, CustomerSubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CustomerSubscriptions and returns the data saved in the database.
     * @param {CustomerSubscriptionCreateManyAndReturnArgs} args - Arguments to create many CustomerSubscriptions.
     * @example
     * // Create many CustomerSubscriptions
     * const customerSubscription = await prisma.customerSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CustomerSubscriptions and only return the `id`
     * const customerSubscriptionWithIdOnly = await prisma.customerSubscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerSubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerSubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CustomerSubscription.
     * @param {CustomerSubscriptionDeleteArgs} args - Arguments to delete one CustomerSubscription.
     * @example
     * // Delete one CustomerSubscription
     * const CustomerSubscription = await prisma.customerSubscription.delete({
     *   where: {
     *     // ... filter to delete one CustomerSubscription
     *   }
     * })
     * 
     */
    delete<T extends CustomerSubscriptionDeleteArgs>(args: SelectSubset<T, CustomerSubscriptionDeleteArgs<ExtArgs>>): Prisma__CustomerSubscriptionClient<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomerSubscription.
     * @param {CustomerSubscriptionUpdateArgs} args - Arguments to update one CustomerSubscription.
     * @example
     * // Update one CustomerSubscription
     * const customerSubscription = await prisma.customerSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerSubscriptionUpdateArgs>(args: SelectSubset<T, CustomerSubscriptionUpdateArgs<ExtArgs>>): Prisma__CustomerSubscriptionClient<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomerSubscriptions.
     * @param {CustomerSubscriptionDeleteManyArgs} args - Arguments to filter CustomerSubscriptions to delete.
     * @example
     * // Delete a few CustomerSubscriptions
     * const { count } = await prisma.customerSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerSubscriptionDeleteManyArgs>(args?: SelectSubset<T, CustomerSubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomerSubscriptions
     * const customerSubscription = await prisma.customerSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerSubscriptionUpdateManyArgs>(args: SelectSubset<T, CustomerSubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerSubscriptions and returns the data updated in the database.
     * @param {CustomerSubscriptionUpdateManyAndReturnArgs} args - Arguments to update many CustomerSubscriptions.
     * @example
     * // Update many CustomerSubscriptions
     * const customerSubscription = await prisma.customerSubscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CustomerSubscriptions and only return the `id`
     * const customerSubscriptionWithIdOnly = await prisma.customerSubscription.updateManyAndReturn({
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
    updateManyAndReturn<T extends CustomerSubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomerSubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CustomerSubscription.
     * @param {CustomerSubscriptionUpsertArgs} args - Arguments to update or create a CustomerSubscription.
     * @example
     * // Update or create a CustomerSubscription
     * const customerSubscription = await prisma.customerSubscription.upsert({
     *   create: {
     *     // ... data to create a CustomerSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomerSubscription we want to update
     *   }
     * })
     */
    upsert<T extends CustomerSubscriptionUpsertArgs>(args: SelectSubset<T, CustomerSubscriptionUpsertArgs<ExtArgs>>): Prisma__CustomerSubscriptionClient<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomerSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerSubscriptionCountArgs} args - Arguments to filter CustomerSubscriptions to count.
     * @example
     * // Count the number of CustomerSubscriptions
     * const count = await prisma.customerSubscription.count({
     *   where: {
     *     // ... the filter for the CustomerSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends CustomerSubscriptionCountArgs>(
      args?: Subset<T, CustomerSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomerSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CustomerSubscriptionAggregateArgs>(args: Subset<T, CustomerSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetCustomerSubscriptionAggregateType<T>>

    /**
     * Group by CustomerSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerSubscriptionGroupByArgs} args - Group by arguments.
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
      T extends CustomerSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: CustomerSubscriptionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CustomerSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomerSubscription model
   */
  readonly fields: CustomerSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomerSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plan<T extends SubscriptionPlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubscriptionPlanDefaultArgs<ExtArgs>>): Prisma__SubscriptionPlanClient<$Result.GetResult<Prisma.$SubscriptionPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    usageTracking<T extends CustomerSubscription$usageTrackingArgs<ExtArgs> = {}>(args?: Subset<T, CustomerSubscription$usageTrackingArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CustomerSubscription model
   */
  interface CustomerSubscriptionFieldRefs {
    readonly id: FieldRef<"CustomerSubscription", 'String'>
    readonly companyId: FieldRef<"CustomerSubscription", 'Int'>
    readonly planId: FieldRef<"CustomerSubscription", 'String'>
    readonly status: FieldRef<"CustomerSubscription", 'SubscriptionStatus'>
    readonly billingInterval: FieldRef<"CustomerSubscription", 'BillingInterval'>
    readonly stripeCustomerId: FieldRef<"CustomerSubscription", 'String'>
    readonly stripeSubscriptionId: FieldRef<"CustomerSubscription", 'String'>
    readonly cancellationDetails: FieldRef<"CustomerSubscription", 'String'>
    readonly currentPeriodStart: FieldRef<"CustomerSubscription", 'DateTime'>
    readonly currentPeriodEnd: FieldRef<"CustomerSubscription", 'DateTime'>
    readonly cancelAtPeriodEnd: FieldRef<"CustomerSubscription", 'Boolean'>
    readonly trialStart: FieldRef<"CustomerSubscription", 'DateTime'>
    readonly trialEnd: FieldRef<"CustomerSubscription", 'DateTime'>
    readonly createdAt: FieldRef<"CustomerSubscription", 'DateTime'>
    readonly updatedAt: FieldRef<"CustomerSubscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomerSubscription findUnique
   */
  export type CustomerSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which CustomerSubscription to fetch.
     */
    where: CustomerSubscriptionWhereUniqueInput
  }

  /**
   * CustomerSubscription findUniqueOrThrow
   */
  export type CustomerSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which CustomerSubscription to fetch.
     */
    where: CustomerSubscriptionWhereUniqueInput
  }

  /**
   * CustomerSubscription findFirst
   */
  export type CustomerSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which CustomerSubscription to fetch.
     */
    where?: CustomerSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerSubscriptions to fetch.
     */
    orderBy?: CustomerSubscriptionOrderByWithRelationInput | CustomerSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerSubscriptions.
     */
    cursor?: CustomerSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerSubscriptions.
     */
    distinct?: CustomerSubscriptionScalarFieldEnum | CustomerSubscriptionScalarFieldEnum[]
  }

  /**
   * CustomerSubscription findFirstOrThrow
   */
  export type CustomerSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which CustomerSubscription to fetch.
     */
    where?: CustomerSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerSubscriptions to fetch.
     */
    orderBy?: CustomerSubscriptionOrderByWithRelationInput | CustomerSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerSubscriptions.
     */
    cursor?: CustomerSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerSubscriptions.
     */
    distinct?: CustomerSubscriptionScalarFieldEnum | CustomerSubscriptionScalarFieldEnum[]
  }

  /**
   * CustomerSubscription findMany
   */
  export type CustomerSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which CustomerSubscriptions to fetch.
     */
    where?: CustomerSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerSubscriptions to fetch.
     */
    orderBy?: CustomerSubscriptionOrderByWithRelationInput | CustomerSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomerSubscriptions.
     */
    cursor?: CustomerSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerSubscriptions.
     */
    skip?: number
    distinct?: CustomerSubscriptionScalarFieldEnum | CustomerSubscriptionScalarFieldEnum[]
  }

  /**
   * CustomerSubscription create
   */
  export type CustomerSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomerSubscription.
     */
    data: XOR<CustomerSubscriptionCreateInput, CustomerSubscriptionUncheckedCreateInput>
  }

  /**
   * CustomerSubscription createMany
   */
  export type CustomerSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomerSubscriptions.
     */
    data: CustomerSubscriptionCreateManyInput | CustomerSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerSubscription createManyAndReturn
   */
  export type CustomerSubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many CustomerSubscriptions.
     */
    data: CustomerSubscriptionCreateManyInput | CustomerSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CustomerSubscription update
   */
  export type CustomerSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomerSubscription.
     */
    data: XOR<CustomerSubscriptionUpdateInput, CustomerSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which CustomerSubscription to update.
     */
    where: CustomerSubscriptionWhereUniqueInput
  }

  /**
   * CustomerSubscription updateMany
   */
  export type CustomerSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomerSubscriptions.
     */
    data: XOR<CustomerSubscriptionUpdateManyMutationInput, CustomerSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which CustomerSubscriptions to update
     */
    where?: CustomerSubscriptionWhereInput
    /**
     * Limit how many CustomerSubscriptions to update.
     */
    limit?: number
  }

  /**
   * CustomerSubscription updateManyAndReturn
   */
  export type CustomerSubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update CustomerSubscriptions.
     */
    data: XOR<CustomerSubscriptionUpdateManyMutationInput, CustomerSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which CustomerSubscriptions to update
     */
    where?: CustomerSubscriptionWhereInput
    /**
     * Limit how many CustomerSubscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CustomerSubscription upsert
   */
  export type CustomerSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomerSubscription to update in case it exists.
     */
    where: CustomerSubscriptionWhereUniqueInput
    /**
     * In case the CustomerSubscription found by the `where` argument doesn't exist, create a new CustomerSubscription with this data.
     */
    create: XOR<CustomerSubscriptionCreateInput, CustomerSubscriptionUncheckedCreateInput>
    /**
     * In case the CustomerSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerSubscriptionUpdateInput, CustomerSubscriptionUncheckedUpdateInput>
  }

  /**
   * CustomerSubscription delete
   */
  export type CustomerSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which CustomerSubscription to delete.
     */
    where: CustomerSubscriptionWhereUniqueInput
  }

  /**
   * CustomerSubscription deleteMany
   */
  export type CustomerSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerSubscriptions to delete
     */
    where?: CustomerSubscriptionWhereInput
    /**
     * Limit how many CustomerSubscriptions to delete.
     */
    limit?: number
  }

  /**
   * CustomerSubscription.usageTracking
   */
  export type CustomerSubscription$usageTrackingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    where?: UsageTrackingWhereInput
    orderBy?: UsageTrackingOrderByWithRelationInput | UsageTrackingOrderByWithRelationInput[]
    cursor?: UsageTrackingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsageTrackingScalarFieldEnum | UsageTrackingScalarFieldEnum[]
  }

  /**
   * CustomerSubscription without action
   */
  export type CustomerSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerSubscription
     */
    select?: CustomerSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerSubscription
     */
    omit?: CustomerSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerSubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model UsageTracking
   */

  export type AggregateUsageTracking = {
    _count: UsageTrackingCountAggregateOutputType | null
    _avg: UsageTrackingAvgAggregateOutputType | null
    _sum: UsageTrackingSumAggregateOutputType | null
    _min: UsageTrackingMinAggregateOutputType | null
    _max: UsageTrackingMaxAggregateOutputType | null
  }

  export type UsageTrackingAvgAggregateOutputType = {
    companyId: number | null
    currentUsage: number | null
    limitValue: number | null
  }

  export type UsageTrackingSumAggregateOutputType = {
    companyId: number | null
    currentUsage: number | null
    limitValue: number | null
  }

  export type UsageTrackingMinAggregateOutputType = {
    id: string | null
    companyId: number | null
    subscriptionId: string | null
    metricType: $Enums.UsageMetricType | null
    currentUsage: number | null
    limitValue: number | null
    periodStart: Date | null
    periodEnd: Date | null
    lastResetDate: Date | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type UsageTrackingMaxAggregateOutputType = {
    id: string | null
    companyId: number | null
    subscriptionId: string | null
    metricType: $Enums.UsageMetricType | null
    currentUsage: number | null
    limitValue: number | null
    periodStart: Date | null
    periodEnd: Date | null
    lastResetDate: Date | null
    lastUpdated: Date | null
    createdAt: Date | null
  }

  export type UsageTrackingCountAggregateOutputType = {
    id: number
    companyId: number
    subscriptionId: number
    metricType: number
    currentUsage: number
    limitValue: number
    periodStart: number
    periodEnd: number
    lastResetDate: number
    lastUpdated: number
    createdAt: number
    _all: number
  }


  export type UsageTrackingAvgAggregateInputType = {
    companyId?: true
    currentUsage?: true
    limitValue?: true
  }

  export type UsageTrackingSumAggregateInputType = {
    companyId?: true
    currentUsage?: true
    limitValue?: true
  }

  export type UsageTrackingMinAggregateInputType = {
    id?: true
    companyId?: true
    subscriptionId?: true
    metricType?: true
    currentUsage?: true
    limitValue?: true
    periodStart?: true
    periodEnd?: true
    lastResetDate?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type UsageTrackingMaxAggregateInputType = {
    id?: true
    companyId?: true
    subscriptionId?: true
    metricType?: true
    currentUsage?: true
    limitValue?: true
    periodStart?: true
    periodEnd?: true
    lastResetDate?: true
    lastUpdated?: true
    createdAt?: true
  }

  export type UsageTrackingCountAggregateInputType = {
    id?: true
    companyId?: true
    subscriptionId?: true
    metricType?: true
    currentUsage?: true
    limitValue?: true
    periodStart?: true
    periodEnd?: true
    lastResetDate?: true
    lastUpdated?: true
    createdAt?: true
    _all?: true
  }

  export type UsageTrackingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageTracking to aggregate.
     */
    where?: UsageTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageTrackings to fetch.
     */
    orderBy?: UsageTrackingOrderByWithRelationInput | UsageTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsageTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsageTrackings
    **/
    _count?: true | UsageTrackingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsageTrackingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsageTrackingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsageTrackingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsageTrackingMaxAggregateInputType
  }

  export type GetUsageTrackingAggregateType<T extends UsageTrackingAggregateArgs> = {
        [P in keyof T & keyof AggregateUsageTracking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsageTracking[P]>
      : GetScalarType<T[P], AggregateUsageTracking[P]>
  }




  export type UsageTrackingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageTrackingWhereInput
    orderBy?: UsageTrackingOrderByWithAggregationInput | UsageTrackingOrderByWithAggregationInput[]
    by: UsageTrackingScalarFieldEnum[] | UsageTrackingScalarFieldEnum
    having?: UsageTrackingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsageTrackingCountAggregateInputType | true
    _avg?: UsageTrackingAvgAggregateInputType
    _sum?: UsageTrackingSumAggregateInputType
    _min?: UsageTrackingMinAggregateInputType
    _max?: UsageTrackingMaxAggregateInputType
  }

  export type UsageTrackingGroupByOutputType = {
    id: string
    companyId: number
    subscriptionId: string
    metricType: $Enums.UsageMetricType
    currentUsage: number
    limitValue: number
    periodStart: Date
    periodEnd: Date
    lastResetDate: Date | null
    lastUpdated: Date
    createdAt: Date
    _count: UsageTrackingCountAggregateOutputType | null
    _avg: UsageTrackingAvgAggregateOutputType | null
    _sum: UsageTrackingSumAggregateOutputType | null
    _min: UsageTrackingMinAggregateOutputType | null
    _max: UsageTrackingMaxAggregateOutputType | null
  }

  type GetUsageTrackingGroupByPayload<T extends UsageTrackingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsageTrackingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsageTrackingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsageTrackingGroupByOutputType[P]>
            : GetScalarType<T[P], UsageTrackingGroupByOutputType[P]>
        }
      >
    >


  export type UsageTrackingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    subscriptionId?: boolean
    metricType?: boolean
    currentUsage?: boolean
    limitValue?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    lastResetDate?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    subscription?: boolean | CustomerSubscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageTracking"]>

  export type UsageTrackingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    subscriptionId?: boolean
    metricType?: boolean
    currentUsage?: boolean
    limitValue?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    lastResetDate?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    subscription?: boolean | CustomerSubscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageTracking"]>

  export type UsageTrackingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyId?: boolean
    subscriptionId?: boolean
    metricType?: boolean
    currentUsage?: boolean
    limitValue?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    lastResetDate?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    subscription?: boolean | CustomerSubscriptionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageTracking"]>

  export type UsageTrackingSelectScalar = {
    id?: boolean
    companyId?: boolean
    subscriptionId?: boolean
    metricType?: boolean
    currentUsage?: boolean
    limitValue?: boolean
    periodStart?: boolean
    periodEnd?: boolean
    lastResetDate?: boolean
    lastUpdated?: boolean
    createdAt?: boolean
  }

  export type UsageTrackingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyId" | "subscriptionId" | "metricType" | "currentUsage" | "limitValue" | "periodStart" | "periodEnd" | "lastResetDate" | "lastUpdated" | "createdAt", ExtArgs["result"]["usageTracking"]>
  export type UsageTrackingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    subscription?: boolean | CustomerSubscriptionDefaultArgs<ExtArgs>
  }
  export type UsageTrackingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    subscription?: boolean | CustomerSubscriptionDefaultArgs<ExtArgs>
  }
  export type UsageTrackingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    subscription?: boolean | CustomerSubscriptionDefaultArgs<ExtArgs>
  }

  export type $UsageTrackingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UsageTracking"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      subscription: Prisma.$CustomerSubscriptionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyId: number
      subscriptionId: string
      metricType: $Enums.UsageMetricType
      currentUsage: number
      limitValue: number
      periodStart: Date
      periodEnd: Date
      lastResetDate: Date | null
      lastUpdated: Date
      createdAt: Date
    }, ExtArgs["result"]["usageTracking"]>
    composites: {}
  }

  type UsageTrackingGetPayload<S extends boolean | null | undefined | UsageTrackingDefaultArgs> = $Result.GetResult<Prisma.$UsageTrackingPayload, S>

  type UsageTrackingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsageTrackingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsageTrackingCountAggregateInputType | true
    }

  export interface UsageTrackingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UsageTracking'], meta: { name: 'UsageTracking' } }
    /**
     * Find zero or one UsageTracking that matches the filter.
     * @param {UsageTrackingFindUniqueArgs} args - Arguments to find a UsageTracking
     * @example
     * // Get one UsageTracking
     * const usageTracking = await prisma.usageTracking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsageTrackingFindUniqueArgs>(args: SelectSubset<T, UsageTrackingFindUniqueArgs<ExtArgs>>): Prisma__UsageTrackingClient<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UsageTracking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsageTrackingFindUniqueOrThrowArgs} args - Arguments to find a UsageTracking
     * @example
     * // Get one UsageTracking
     * const usageTracking = await prisma.usageTracking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsageTrackingFindUniqueOrThrowArgs>(args: SelectSubset<T, UsageTrackingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsageTrackingClient<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageTracking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageTrackingFindFirstArgs} args - Arguments to find a UsageTracking
     * @example
     * // Get one UsageTracking
     * const usageTracking = await prisma.usageTracking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsageTrackingFindFirstArgs>(args?: SelectSubset<T, UsageTrackingFindFirstArgs<ExtArgs>>): Prisma__UsageTrackingClient<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageTracking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageTrackingFindFirstOrThrowArgs} args - Arguments to find a UsageTracking
     * @example
     * // Get one UsageTracking
     * const usageTracking = await prisma.usageTracking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsageTrackingFindFirstOrThrowArgs>(args?: SelectSubset<T, UsageTrackingFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsageTrackingClient<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UsageTrackings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageTrackingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsageTrackings
     * const usageTrackings = await prisma.usageTracking.findMany()
     * 
     * // Get first 10 UsageTrackings
     * const usageTrackings = await prisma.usageTracking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usageTrackingWithIdOnly = await prisma.usageTracking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsageTrackingFindManyArgs>(args?: SelectSubset<T, UsageTrackingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UsageTracking.
     * @param {UsageTrackingCreateArgs} args - Arguments to create a UsageTracking.
     * @example
     * // Create one UsageTracking
     * const UsageTracking = await prisma.usageTracking.create({
     *   data: {
     *     // ... data to create a UsageTracking
     *   }
     * })
     * 
     */
    create<T extends UsageTrackingCreateArgs>(args: SelectSubset<T, UsageTrackingCreateArgs<ExtArgs>>): Prisma__UsageTrackingClient<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UsageTrackings.
     * @param {UsageTrackingCreateManyArgs} args - Arguments to create many UsageTrackings.
     * @example
     * // Create many UsageTrackings
     * const usageTracking = await prisma.usageTracking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsageTrackingCreateManyArgs>(args?: SelectSubset<T, UsageTrackingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UsageTrackings and returns the data saved in the database.
     * @param {UsageTrackingCreateManyAndReturnArgs} args - Arguments to create many UsageTrackings.
     * @example
     * // Create many UsageTrackings
     * const usageTracking = await prisma.usageTracking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UsageTrackings and only return the `id`
     * const usageTrackingWithIdOnly = await prisma.usageTracking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsageTrackingCreateManyAndReturnArgs>(args?: SelectSubset<T, UsageTrackingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UsageTracking.
     * @param {UsageTrackingDeleteArgs} args - Arguments to delete one UsageTracking.
     * @example
     * // Delete one UsageTracking
     * const UsageTracking = await prisma.usageTracking.delete({
     *   where: {
     *     // ... filter to delete one UsageTracking
     *   }
     * })
     * 
     */
    delete<T extends UsageTrackingDeleteArgs>(args: SelectSubset<T, UsageTrackingDeleteArgs<ExtArgs>>): Prisma__UsageTrackingClient<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UsageTracking.
     * @param {UsageTrackingUpdateArgs} args - Arguments to update one UsageTracking.
     * @example
     * // Update one UsageTracking
     * const usageTracking = await prisma.usageTracking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsageTrackingUpdateArgs>(args: SelectSubset<T, UsageTrackingUpdateArgs<ExtArgs>>): Prisma__UsageTrackingClient<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UsageTrackings.
     * @param {UsageTrackingDeleteManyArgs} args - Arguments to filter UsageTrackings to delete.
     * @example
     * // Delete a few UsageTrackings
     * const { count } = await prisma.usageTracking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsageTrackingDeleteManyArgs>(args?: SelectSubset<T, UsageTrackingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageTrackingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsageTrackings
     * const usageTracking = await prisma.usageTracking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsageTrackingUpdateManyArgs>(args: SelectSubset<T, UsageTrackingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageTrackings and returns the data updated in the database.
     * @param {UsageTrackingUpdateManyAndReturnArgs} args - Arguments to update many UsageTrackings.
     * @example
     * // Update many UsageTrackings
     * const usageTracking = await prisma.usageTracking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UsageTrackings and only return the `id`
     * const usageTrackingWithIdOnly = await prisma.usageTracking.updateManyAndReturn({
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
    updateManyAndReturn<T extends UsageTrackingUpdateManyAndReturnArgs>(args: SelectSubset<T, UsageTrackingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UsageTracking.
     * @param {UsageTrackingUpsertArgs} args - Arguments to update or create a UsageTracking.
     * @example
     * // Update or create a UsageTracking
     * const usageTracking = await prisma.usageTracking.upsert({
     *   create: {
     *     // ... data to create a UsageTracking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsageTracking we want to update
     *   }
     * })
     */
    upsert<T extends UsageTrackingUpsertArgs>(args: SelectSubset<T, UsageTrackingUpsertArgs<ExtArgs>>): Prisma__UsageTrackingClient<$Result.GetResult<Prisma.$UsageTrackingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UsageTrackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageTrackingCountArgs} args - Arguments to filter UsageTrackings to count.
     * @example
     * // Count the number of UsageTrackings
     * const count = await prisma.usageTracking.count({
     *   where: {
     *     // ... the filter for the UsageTrackings we want to count
     *   }
     * })
    **/
    count<T extends UsageTrackingCountArgs>(
      args?: Subset<T, UsageTrackingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsageTrackingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsageTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageTrackingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UsageTrackingAggregateArgs>(args: Subset<T, UsageTrackingAggregateArgs>): Prisma.PrismaPromise<GetUsageTrackingAggregateType<T>>

    /**
     * Group by UsageTracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageTrackingGroupByArgs} args - Group by arguments.
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
      T extends UsageTrackingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsageTrackingGroupByArgs['orderBy'] }
        : { orderBy?: UsageTrackingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UsageTrackingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsageTrackingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UsageTracking model
   */
  readonly fields: UsageTrackingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsageTracking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsageTrackingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    subscription<T extends CustomerSubscriptionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerSubscriptionDefaultArgs<ExtArgs>>): Prisma__CustomerSubscriptionClient<$Result.GetResult<Prisma.$CustomerSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UsageTracking model
   */
  interface UsageTrackingFieldRefs {
    readonly id: FieldRef<"UsageTracking", 'String'>
    readonly companyId: FieldRef<"UsageTracking", 'Int'>
    readonly subscriptionId: FieldRef<"UsageTracking", 'String'>
    readonly metricType: FieldRef<"UsageTracking", 'UsageMetricType'>
    readonly currentUsage: FieldRef<"UsageTracking", 'Int'>
    readonly limitValue: FieldRef<"UsageTracking", 'Int'>
    readonly periodStart: FieldRef<"UsageTracking", 'DateTime'>
    readonly periodEnd: FieldRef<"UsageTracking", 'DateTime'>
    readonly lastResetDate: FieldRef<"UsageTracking", 'DateTime'>
    readonly lastUpdated: FieldRef<"UsageTracking", 'DateTime'>
    readonly createdAt: FieldRef<"UsageTracking", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UsageTracking findUnique
   */
  export type UsageTrackingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    /**
     * Filter, which UsageTracking to fetch.
     */
    where: UsageTrackingWhereUniqueInput
  }

  /**
   * UsageTracking findUniqueOrThrow
   */
  export type UsageTrackingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    /**
     * Filter, which UsageTracking to fetch.
     */
    where: UsageTrackingWhereUniqueInput
  }

  /**
   * UsageTracking findFirst
   */
  export type UsageTrackingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    /**
     * Filter, which UsageTracking to fetch.
     */
    where?: UsageTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageTrackings to fetch.
     */
    orderBy?: UsageTrackingOrderByWithRelationInput | UsageTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageTrackings.
     */
    cursor?: UsageTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageTrackings.
     */
    distinct?: UsageTrackingScalarFieldEnum | UsageTrackingScalarFieldEnum[]
  }

  /**
   * UsageTracking findFirstOrThrow
   */
  export type UsageTrackingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    /**
     * Filter, which UsageTracking to fetch.
     */
    where?: UsageTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageTrackings to fetch.
     */
    orderBy?: UsageTrackingOrderByWithRelationInput | UsageTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageTrackings.
     */
    cursor?: UsageTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageTrackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageTrackings.
     */
    distinct?: UsageTrackingScalarFieldEnum | UsageTrackingScalarFieldEnum[]
  }

  /**
   * UsageTracking findMany
   */
  export type UsageTrackingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    /**
     * Filter, which UsageTrackings to fetch.
     */
    where?: UsageTrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageTrackings to fetch.
     */
    orderBy?: UsageTrackingOrderByWithRelationInput | UsageTrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsageTrackings.
     */
    cursor?: UsageTrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageTrackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageTrackings.
     */
    skip?: number
    distinct?: UsageTrackingScalarFieldEnum | UsageTrackingScalarFieldEnum[]
  }

  /**
   * UsageTracking create
   */
  export type UsageTrackingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    /**
     * The data needed to create a UsageTracking.
     */
    data: XOR<UsageTrackingCreateInput, UsageTrackingUncheckedCreateInput>
  }

  /**
   * UsageTracking createMany
   */
  export type UsageTrackingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UsageTrackings.
     */
    data: UsageTrackingCreateManyInput | UsageTrackingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsageTracking createManyAndReturn
   */
  export type UsageTrackingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * The data used to create many UsageTrackings.
     */
    data: UsageTrackingCreateManyInput | UsageTrackingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsageTracking update
   */
  export type UsageTrackingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    /**
     * The data needed to update a UsageTracking.
     */
    data: XOR<UsageTrackingUpdateInput, UsageTrackingUncheckedUpdateInput>
    /**
     * Choose, which UsageTracking to update.
     */
    where: UsageTrackingWhereUniqueInput
  }

  /**
   * UsageTracking updateMany
   */
  export type UsageTrackingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UsageTrackings.
     */
    data: XOR<UsageTrackingUpdateManyMutationInput, UsageTrackingUncheckedUpdateManyInput>
    /**
     * Filter which UsageTrackings to update
     */
    where?: UsageTrackingWhereInput
    /**
     * Limit how many UsageTrackings to update.
     */
    limit?: number
  }

  /**
   * UsageTracking updateManyAndReturn
   */
  export type UsageTrackingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * The data used to update UsageTrackings.
     */
    data: XOR<UsageTrackingUpdateManyMutationInput, UsageTrackingUncheckedUpdateManyInput>
    /**
     * Filter which UsageTrackings to update
     */
    where?: UsageTrackingWhereInput
    /**
     * Limit how many UsageTrackings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsageTracking upsert
   */
  export type UsageTrackingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    /**
     * The filter to search for the UsageTracking to update in case it exists.
     */
    where: UsageTrackingWhereUniqueInput
    /**
     * In case the UsageTracking found by the `where` argument doesn't exist, create a new UsageTracking with this data.
     */
    create: XOR<UsageTrackingCreateInput, UsageTrackingUncheckedCreateInput>
    /**
     * In case the UsageTracking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsageTrackingUpdateInput, UsageTrackingUncheckedUpdateInput>
  }

  /**
   * UsageTracking delete
   */
  export type UsageTrackingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
    /**
     * Filter which UsageTracking to delete.
     */
    where: UsageTrackingWhereUniqueInput
  }

  /**
   * UsageTracking deleteMany
   */
  export type UsageTrackingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageTrackings to delete
     */
    where?: UsageTrackingWhereInput
    /**
     * Limit how many UsageTrackings to delete.
     */
    limit?: number
  }

  /**
   * UsageTracking without action
   */
  export type UsageTrackingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageTracking
     */
    select?: UsageTrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageTracking
     */
    omit?: UsageTrackingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageTrackingInclude<ExtArgs> | null
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
    email: 'email',
    provider: 'provider',
    password: 'password',
    resetPasswordToken: 'resetPasswordToken',
    confirmationToken: 'confirmationToken',
    confirmed: 'confirmed',
    blocked: 'blocked',
    phone: 'phone',
    firstName: 'firstName',
    lastName: 'lastName',
    position: 'position',
    companyName: 'companyName',
    country: 'country',
    linkedinUrl: 'linkedinUrl',
    twitterUrl: 'twitterUrl',
    websiteUrl: 'websiteUrl',
    githubUrl: 'githubUrl',
    avatarUrl: 'avatarUrl',
    language: 'language',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    avatarId: 'avatarId',
    idProvider: 'idProvider',
    resetPasswordExpires: 'resetPasswordExpires',
    theme: 'theme',
    defaultCompanyId: 'defaultCompanyId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const FileScalarFieldEnum: {
    id: 'id',
    name: 'name',
    url: 'url',
    publicId: 'publicId',
    format: 'format',
    version: 'version',
    mimeType: 'mimeType',
    size: 'size',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FileScalarFieldEnum = (typeof FileScalarFieldEnum)[keyof typeof FileScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const CompanyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    tokenApi: 'tokenApi',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const CompanyMemberScalarFieldEnum: {
    id: 'id',
    isAdmin: 'isAdmin',
    canPost: 'canPost',
    canApprove: 'canApprove',
    isOwner: 'isOwner',
    companyMemberStatus: 'companyMemberStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    companyId: 'companyId'
  };

  export type CompanyMemberScalarFieldEnum = (typeof CompanyMemberScalarFieldEnum)[keyof typeof CompanyMemberScalarFieldEnum]


  export const SubscriptionPlanScalarFieldEnum: {
    id: 'id',
    planType: 'planType',
    stripeProductId: 'stripeProductId',
    stripePriceIdMonthly: 'stripePriceIdMonthly',
    stripePriceIdYearly: 'stripePriceIdYearly',
    priceMonthly: 'priceMonthly',
    priceYearly: 'priceYearly',
    currency: 'currency',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionPlanScalarFieldEnum = (typeof SubscriptionPlanScalarFieldEnum)[keyof typeof SubscriptionPlanScalarFieldEnum]


  export const CustomerSubscriptionScalarFieldEnum: {
    id: 'id',
    companyId: 'companyId',
    planId: 'planId',
    status: 'status',
    billingInterval: 'billingInterval',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubscriptionId: 'stripeSubscriptionId',
    cancellationDetails: 'cancellationDetails',
    currentPeriodStart: 'currentPeriodStart',
    currentPeriodEnd: 'currentPeriodEnd',
    cancelAtPeriodEnd: 'cancelAtPeriodEnd',
    trialStart: 'trialStart',
    trialEnd: 'trialEnd',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomerSubscriptionScalarFieldEnum = (typeof CustomerSubscriptionScalarFieldEnum)[keyof typeof CustomerSubscriptionScalarFieldEnum]


  export const UsageTrackingScalarFieldEnum: {
    id: 'id',
    companyId: 'companyId',
    subscriptionId: 'subscriptionId',
    metricType: 'metricType',
    currentUsage: 'currentUsage',
    limitValue: 'limitValue',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    lastResetDate: 'lastResetDate',
    lastUpdated: 'lastUpdated',
    createdAt: 'createdAt'
  };

  export type UsageTrackingScalarFieldEnum = (typeof UsageTrackingScalarFieldEnum)[keyof typeof UsageTrackingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Provider'
   */
  export type EnumProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Provider'>
    


  /**
   * Reference to a field of type 'Provider[]'
   */
  export type ListEnumProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Provider[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Language'
   */
  export type EnumLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Language'>
    


  /**
   * Reference to a field of type 'Language[]'
   */
  export type ListEnumLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Language[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Theme'
   */
  export type EnumThemeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Theme'>
    


  /**
   * Reference to a field of type 'Theme[]'
   */
  export type ListEnumThemeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Theme[]'>
    


  /**
   * Reference to a field of type 'CompanyMemberStatus'
   */
  export type EnumCompanyMemberStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompanyMemberStatus'>
    


  /**
   * Reference to a field of type 'CompanyMemberStatus[]'
   */
  export type ListEnumCompanyMemberStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CompanyMemberStatus[]'>
    


  /**
   * Reference to a field of type 'PlanType'
   */
  export type EnumPlanTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanType'>
    


  /**
   * Reference to a field of type 'PlanType[]'
   */
  export type ListEnumPlanTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanType[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus'
   */
  export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus[]'
   */
  export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>
    


  /**
   * Reference to a field of type 'BillingInterval'
   */
  export type EnumBillingIntervalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingInterval'>
    


  /**
   * Reference to a field of type 'BillingInterval[]'
   */
  export type ListEnumBillingIntervalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BillingInterval[]'>
    


  /**
   * Reference to a field of type 'UsageMetricType'
   */
  export type EnumUsageMetricTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UsageMetricType'>
    


  /**
   * Reference to a field of type 'UsageMetricType[]'
   */
  export type ListEnumUsageMetricTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UsageMetricType[]'>
    


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
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    provider?: EnumProviderFilter<"User"> | $Enums.Provider
    password?: StringNullableFilter<"User"> | string | null
    resetPasswordToken?: StringNullableFilter<"User"> | string | null
    confirmationToken?: StringNullableFilter<"User"> | string | null
    confirmed?: BoolNullableFilter<"User"> | boolean | null
    blocked?: BoolNullableFilter<"User"> | boolean | null
    phone?: StringNullableFilter<"User"> | string | null
    firstName?: StringFilter<"User"> | string
    lastName?: StringNullableFilter<"User"> | string | null
    position?: StringNullableFilter<"User"> | string | null
    companyName?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    linkedinUrl?: StringNullableFilter<"User"> | string | null
    twitterUrl?: StringNullableFilter<"User"> | string | null
    websiteUrl?: StringNullableFilter<"User"> | string | null
    githubUrl?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    language?: EnumLanguageFilter<"User"> | $Enums.Language
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    avatarId?: StringNullableFilter<"User"> | string | null
    idProvider?: StringNullableFilter<"User"> | string | null
    resetPasswordExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    theme?: EnumThemeFilter<"User"> | $Enums.Theme
    defaultCompanyId?: IntNullableFilter<"User"> | number | null
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    companyMembers?: CompanyMemberListRelationFilter
    avatar?: XOR<FileNullableScalarRelationFilter, FileWhereInput> | null
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    files?: FileListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    password?: SortOrderInput | SortOrder
    resetPasswordToken?: SortOrderInput | SortOrder
    confirmationToken?: SortOrderInput | SortOrder
    confirmed?: SortOrderInput | SortOrder
    blocked?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    linkedinUrl?: SortOrderInput | SortOrder
    twitterUrl?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    githubUrl?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    avatarId?: SortOrderInput | SortOrder
    idProvider?: SortOrderInput | SortOrder
    resetPasswordExpires?: SortOrderInput | SortOrder
    theme?: SortOrder
    defaultCompanyId?: SortOrderInput | SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    companyMembers?: CompanyMemberOrderByRelationAggregateInput
    avatar?: FileOrderByWithRelationInput
    company?: CompanyOrderByWithRelationInput
    files?: FileOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    provider?: EnumProviderFilter<"User"> | $Enums.Provider
    password?: StringNullableFilter<"User"> | string | null
    resetPasswordToken?: StringNullableFilter<"User"> | string | null
    confirmationToken?: StringNullableFilter<"User"> | string | null
    confirmed?: BoolNullableFilter<"User"> | boolean | null
    blocked?: BoolNullableFilter<"User"> | boolean | null
    phone?: StringNullableFilter<"User"> | string | null
    firstName?: StringFilter<"User"> | string
    lastName?: StringNullableFilter<"User"> | string | null
    position?: StringNullableFilter<"User"> | string | null
    companyName?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    linkedinUrl?: StringNullableFilter<"User"> | string | null
    twitterUrl?: StringNullableFilter<"User"> | string | null
    websiteUrl?: StringNullableFilter<"User"> | string | null
    githubUrl?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    language?: EnumLanguageFilter<"User"> | $Enums.Language
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    avatarId?: StringNullableFilter<"User"> | string | null
    idProvider?: StringNullableFilter<"User"> | string | null
    resetPasswordExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    theme?: EnumThemeFilter<"User"> | $Enums.Theme
    defaultCompanyId?: IntNullableFilter<"User"> | number | null
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    companyMembers?: CompanyMemberListRelationFilter
    avatar?: XOR<FileNullableScalarRelationFilter, FileWhereInput> | null
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    files?: FileListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    password?: SortOrderInput | SortOrder
    resetPasswordToken?: SortOrderInput | SortOrder
    confirmationToken?: SortOrderInput | SortOrder
    confirmed?: SortOrderInput | SortOrder
    blocked?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    linkedinUrl?: SortOrderInput | SortOrder
    twitterUrl?: SortOrderInput | SortOrder
    websiteUrl?: SortOrderInput | SortOrder
    githubUrl?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    avatarId?: SortOrderInput | SortOrder
    idProvider?: SortOrderInput | SortOrder
    resetPasswordExpires?: SortOrderInput | SortOrder
    theme?: SortOrder
    defaultCompanyId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringWithAggregatesFilter<"User"> | string
    provider?: EnumProviderWithAggregatesFilter<"User"> | $Enums.Provider
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    resetPasswordToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    confirmationToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    confirmed?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    blocked?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    position?: StringNullableWithAggregatesFilter<"User"> | string | null
    companyName?: StringNullableWithAggregatesFilter<"User"> | string | null
    country?: StringNullableWithAggregatesFilter<"User"> | string | null
    linkedinUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    twitterUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    websiteUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    githubUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    language?: EnumLanguageWithAggregatesFilter<"User"> | $Enums.Language
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    avatarId?: StringNullableWithAggregatesFilter<"User"> | string | null
    idProvider?: StringNullableWithAggregatesFilter<"User"> | string | null
    resetPasswordExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    theme?: EnumThemeWithAggregatesFilter<"User"> | $Enums.Theme
    defaultCompanyId?: IntNullableWithAggregatesFilter<"User"> | number | null
  }

  export type FileWhereInput = {
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    id?: StringFilter<"File"> | string
    name?: StringFilter<"File"> | string
    url?: StringFilter<"File"> | string
    publicId?: StringNullableFilter<"File"> | string | null
    format?: StringNullableFilter<"File"> | string | null
    version?: StringNullableFilter<"File"> | string | null
    mimeType?: StringNullableFilter<"File"> | string | null
    size?: IntNullableFilter<"File"> | number | null
    userId?: IntNullableFilter<"File"> | number | null
    createdAt?: DateTimeFilter<"File"> | Date | string
    updatedAt?: DateTimeFilter<"File"> | Date | string
    avatarFor?: UserListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type FileOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    publicId?: SortOrderInput | SortOrder
    format?: SortOrderInput | SortOrder
    version?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    size?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    avatarFor?: UserOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
  }

  export type FileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FileWhereInput | FileWhereInput[]
    OR?: FileWhereInput[]
    NOT?: FileWhereInput | FileWhereInput[]
    name?: StringFilter<"File"> | string
    url?: StringFilter<"File"> | string
    publicId?: StringNullableFilter<"File"> | string | null
    format?: StringNullableFilter<"File"> | string | null
    version?: StringNullableFilter<"File"> | string | null
    mimeType?: StringNullableFilter<"File"> | string | null
    size?: IntNullableFilter<"File"> | number | null
    userId?: IntNullableFilter<"File"> | number | null
    createdAt?: DateTimeFilter<"File"> | Date | string
    updatedAt?: DateTimeFilter<"File"> | Date | string
    avatarFor?: UserListRelationFilter
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "id">

  export type FileOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    publicId?: SortOrderInput | SortOrder
    format?: SortOrderInput | SortOrder
    version?: SortOrderInput | SortOrder
    mimeType?: SortOrderInput | SortOrder
    size?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FileCountOrderByAggregateInput
    _avg?: FileAvgOrderByAggregateInput
    _max?: FileMaxOrderByAggregateInput
    _min?: FileMinOrderByAggregateInput
    _sum?: FileSumOrderByAggregateInput
  }

  export type FileScalarWhereWithAggregatesInput = {
    AND?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    OR?: FileScalarWhereWithAggregatesInput[]
    NOT?: FileScalarWhereWithAggregatesInput | FileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"File"> | string
    name?: StringWithAggregatesFilter<"File"> | string
    url?: StringWithAggregatesFilter<"File"> | string
    publicId?: StringNullableWithAggregatesFilter<"File"> | string | null
    format?: StringNullableWithAggregatesFilter<"File"> | string | null
    version?: StringNullableWithAggregatesFilter<"File"> | string | null
    mimeType?: StringNullableWithAggregatesFilter<"File"> | string | null
    size?: IntNullableWithAggregatesFilter<"File"> | number | null
    userId?: IntNullableWithAggregatesFilter<"File"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"File"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"File"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: IntFilter<"Account"> | number
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: IntFilter<"Account"> | number
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: IntWithAggregatesFilter<"Account"> | number
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: IntFilter<"Session"> | number
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: IntFilter<"Session"> | number
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _avg?: SessionAvgOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
    _sum?: SessionSumOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: IntWithAggregatesFilter<"Session"> | number
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    id?: IntFilter<"Company"> | number
    name?: StringFilter<"Company"> | string
    description?: StringNullableFilter<"Company"> | string | null
    tokenApi?: StringNullableFilter<"Company"> | string | null
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    members?: CompanyMemberListRelationFilter
    user?: UserListRelationFilter
    CustomerSubscription?: CustomerSubscriptionListRelationFilter
    UsageTracking?: UsageTrackingListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    tokenApi?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    members?: CompanyMemberOrderByRelationAggregateInput
    user?: UserOrderByRelationAggregateInput
    CustomerSubscription?: CustomerSubscriptionOrderByRelationAggregateInput
    UsageTracking?: UsageTrackingOrderByRelationAggregateInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    name?: StringFilter<"Company"> | string
    description?: StringNullableFilter<"Company"> | string | null
    tokenApi?: StringNullableFilter<"Company"> | string | null
    createdAt?: DateTimeFilter<"Company"> | Date | string
    updatedAt?: DateTimeFilter<"Company"> | Date | string
    members?: CompanyMemberListRelationFilter
    user?: UserListRelationFilter
    CustomerSubscription?: CustomerSubscriptionListRelationFilter
    UsageTracking?: UsageTrackingListRelationFilter
  }, "id">

  export type CompanyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    tokenApi?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _avg?: CompanyAvgOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
    _sum?: CompanySumOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Company"> | number
    name?: StringWithAggregatesFilter<"Company"> | string
    description?: StringNullableWithAggregatesFilter<"Company"> | string | null
    tokenApi?: StringNullableWithAggregatesFilter<"Company"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Company"> | Date | string
  }

  export type CompanyMemberWhereInput = {
    AND?: CompanyMemberWhereInput | CompanyMemberWhereInput[]
    OR?: CompanyMemberWhereInput[]
    NOT?: CompanyMemberWhereInput | CompanyMemberWhereInput[]
    id?: IntFilter<"CompanyMember"> | number
    isAdmin?: BoolFilter<"CompanyMember"> | boolean
    canPost?: BoolFilter<"CompanyMember"> | boolean
    canApprove?: BoolFilter<"CompanyMember"> | boolean
    isOwner?: BoolFilter<"CompanyMember"> | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFilter<"CompanyMember"> | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFilter<"CompanyMember"> | Date | string
    updatedAt?: DateTimeFilter<"CompanyMember"> | Date | string
    userId?: IntFilter<"CompanyMember"> | number
    companyId?: IntFilter<"CompanyMember"> | number
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CompanyMemberOrderByWithRelationInput = {
    id?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    canApprove?: SortOrder
    isOwner?: SortOrder
    companyMemberStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    companyId?: SortOrder
    company?: CompanyOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type CompanyMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_companyId?: CompanyMemberUserIdCompanyIdCompoundUniqueInput
    AND?: CompanyMemberWhereInput | CompanyMemberWhereInput[]
    OR?: CompanyMemberWhereInput[]
    NOT?: CompanyMemberWhereInput | CompanyMemberWhereInput[]
    isAdmin?: BoolFilter<"CompanyMember"> | boolean
    canPost?: BoolFilter<"CompanyMember"> | boolean
    canApprove?: BoolFilter<"CompanyMember"> | boolean
    isOwner?: BoolFilter<"CompanyMember"> | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFilter<"CompanyMember"> | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFilter<"CompanyMember"> | Date | string
    updatedAt?: DateTimeFilter<"CompanyMember"> | Date | string
    userId?: IntFilter<"CompanyMember"> | number
    companyId?: IntFilter<"CompanyMember"> | number
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_companyId">

  export type CompanyMemberOrderByWithAggregationInput = {
    id?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    canApprove?: SortOrder
    isOwner?: SortOrder
    companyMemberStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    companyId?: SortOrder
    _count?: CompanyMemberCountOrderByAggregateInput
    _avg?: CompanyMemberAvgOrderByAggregateInput
    _max?: CompanyMemberMaxOrderByAggregateInput
    _min?: CompanyMemberMinOrderByAggregateInput
    _sum?: CompanyMemberSumOrderByAggregateInput
  }

  export type CompanyMemberScalarWhereWithAggregatesInput = {
    AND?: CompanyMemberScalarWhereWithAggregatesInput | CompanyMemberScalarWhereWithAggregatesInput[]
    OR?: CompanyMemberScalarWhereWithAggregatesInput[]
    NOT?: CompanyMemberScalarWhereWithAggregatesInput | CompanyMemberScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CompanyMember"> | number
    isAdmin?: BoolWithAggregatesFilter<"CompanyMember"> | boolean
    canPost?: BoolWithAggregatesFilter<"CompanyMember"> | boolean
    canApprove?: BoolWithAggregatesFilter<"CompanyMember"> | boolean
    isOwner?: BoolWithAggregatesFilter<"CompanyMember"> | boolean
    companyMemberStatus?: EnumCompanyMemberStatusWithAggregatesFilter<"CompanyMember"> | $Enums.CompanyMemberStatus
    createdAt?: DateTimeWithAggregatesFilter<"CompanyMember"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CompanyMember"> | Date | string
    userId?: IntWithAggregatesFilter<"CompanyMember"> | number
    companyId?: IntWithAggregatesFilter<"CompanyMember"> | number
  }

  export type SubscriptionPlanWhereInput = {
    AND?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    OR?: SubscriptionPlanWhereInput[]
    NOT?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    id?: StringFilter<"SubscriptionPlan"> | string
    planType?: EnumPlanTypeFilter<"SubscriptionPlan"> | $Enums.PlanType
    stripeProductId?: StringNullableFilter<"SubscriptionPlan"> | string | null
    stripePriceIdMonthly?: StringNullableFilter<"SubscriptionPlan"> | string | null
    stripePriceIdYearly?: StringNullableFilter<"SubscriptionPlan"> | string | null
    priceMonthly?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"SubscriptionPlan"> | string
    isActive?: BoolFilter<"SubscriptionPlan"> | boolean
    createdAt?: DateTimeFilter<"SubscriptionPlan"> | Date | string
    updatedAt?: DateTimeFilter<"SubscriptionPlan"> | Date | string
    subscriptions?: CustomerSubscriptionListRelationFilter
  }

  export type SubscriptionPlanOrderByWithRelationInput = {
    id?: SortOrder
    planType?: SortOrder
    stripeProductId?: SortOrderInput | SortOrder
    stripePriceIdMonthly?: SortOrderInput | SortOrder
    stripePriceIdYearly?: SortOrderInput | SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    currency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    subscriptions?: CustomerSubscriptionOrderByRelationAggregateInput
  }

  export type SubscriptionPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    OR?: SubscriptionPlanWhereInput[]
    NOT?: SubscriptionPlanWhereInput | SubscriptionPlanWhereInput[]
    planType?: EnumPlanTypeFilter<"SubscriptionPlan"> | $Enums.PlanType
    stripeProductId?: StringNullableFilter<"SubscriptionPlan"> | string | null
    stripePriceIdMonthly?: StringNullableFilter<"SubscriptionPlan"> | string | null
    stripePriceIdYearly?: StringNullableFilter<"SubscriptionPlan"> | string | null
    priceMonthly?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"SubscriptionPlan"> | string
    isActive?: BoolFilter<"SubscriptionPlan"> | boolean
    createdAt?: DateTimeFilter<"SubscriptionPlan"> | Date | string
    updatedAt?: DateTimeFilter<"SubscriptionPlan"> | Date | string
    subscriptions?: CustomerSubscriptionListRelationFilter
  }, "id">

  export type SubscriptionPlanOrderByWithAggregationInput = {
    id?: SortOrder
    planType?: SortOrder
    stripeProductId?: SortOrderInput | SortOrder
    stripePriceIdMonthly?: SortOrderInput | SortOrder
    stripePriceIdYearly?: SortOrderInput | SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    currency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionPlanCountOrderByAggregateInput
    _avg?: SubscriptionPlanAvgOrderByAggregateInput
    _max?: SubscriptionPlanMaxOrderByAggregateInput
    _min?: SubscriptionPlanMinOrderByAggregateInput
    _sum?: SubscriptionPlanSumOrderByAggregateInput
  }

  export type SubscriptionPlanScalarWhereWithAggregatesInput = {
    AND?: SubscriptionPlanScalarWhereWithAggregatesInput | SubscriptionPlanScalarWhereWithAggregatesInput[]
    OR?: SubscriptionPlanScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionPlanScalarWhereWithAggregatesInput | SubscriptionPlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SubscriptionPlan"> | string
    planType?: EnumPlanTypeWithAggregatesFilter<"SubscriptionPlan"> | $Enums.PlanType
    stripeProductId?: StringNullableWithAggregatesFilter<"SubscriptionPlan"> | string | null
    stripePriceIdMonthly?: StringNullableWithAggregatesFilter<"SubscriptionPlan"> | string | null
    stripePriceIdYearly?: StringNullableWithAggregatesFilter<"SubscriptionPlan"> | string | null
    priceMonthly?: DecimalWithAggregatesFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalWithAggregatesFilter<"SubscriptionPlan"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"SubscriptionPlan"> | string
    isActive?: BoolWithAggregatesFilter<"SubscriptionPlan"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SubscriptionPlan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SubscriptionPlan"> | Date | string
  }

  export type CustomerSubscriptionWhereInput = {
    AND?: CustomerSubscriptionWhereInput | CustomerSubscriptionWhereInput[]
    OR?: CustomerSubscriptionWhereInput[]
    NOT?: CustomerSubscriptionWhereInput | CustomerSubscriptionWhereInput[]
    id?: StringFilter<"CustomerSubscription"> | string
    companyId?: IntFilter<"CustomerSubscription"> | number
    planId?: StringFilter<"CustomerSubscription"> | string
    status?: EnumSubscriptionStatusFilter<"CustomerSubscription"> | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFilter<"CustomerSubscription"> | $Enums.BillingInterval
    stripeCustomerId?: StringNullableFilter<"CustomerSubscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"CustomerSubscription"> | string | null
    cancellationDetails?: StringNullableFilter<"CustomerSubscription"> | string | null
    currentPeriodStart?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolFilter<"CustomerSubscription"> | boolean
    trialStart?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    trialEnd?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    createdAt?: DateTimeFilter<"CustomerSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"CustomerSubscription"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    plan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
    usageTracking?: UsageTrackingListRelationFilter
  }

  export type CustomerSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingInterval?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    cancellationDetails?: SortOrderInput | SortOrder
    currentPeriodStart?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    cancelAtPeriodEnd?: SortOrder
    trialStart?: SortOrderInput | SortOrder
    trialEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
    plan?: SubscriptionPlanOrderByWithRelationInput
    usageTracking?: UsageTrackingOrderByRelationAggregateInput
  }

  export type CustomerSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripeSubscriptionId?: string
    AND?: CustomerSubscriptionWhereInput | CustomerSubscriptionWhereInput[]
    OR?: CustomerSubscriptionWhereInput[]
    NOT?: CustomerSubscriptionWhereInput | CustomerSubscriptionWhereInput[]
    companyId?: IntFilter<"CustomerSubscription"> | number
    planId?: StringFilter<"CustomerSubscription"> | string
    status?: EnumSubscriptionStatusFilter<"CustomerSubscription"> | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFilter<"CustomerSubscription"> | $Enums.BillingInterval
    stripeCustomerId?: StringNullableFilter<"CustomerSubscription"> | string | null
    cancellationDetails?: StringNullableFilter<"CustomerSubscription"> | string | null
    currentPeriodStart?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolFilter<"CustomerSubscription"> | boolean
    trialStart?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    trialEnd?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    createdAt?: DateTimeFilter<"CustomerSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"CustomerSubscription"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    plan?: XOR<SubscriptionPlanScalarRelationFilter, SubscriptionPlanWhereInput>
    usageTracking?: UsageTrackingListRelationFilter
  }, "id" | "stripeSubscriptionId">

  export type CustomerSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingInterval?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubscriptionId?: SortOrderInput | SortOrder
    cancellationDetails?: SortOrderInput | SortOrder
    currentPeriodStart?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    cancelAtPeriodEnd?: SortOrder
    trialStart?: SortOrderInput | SortOrder
    trialEnd?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomerSubscriptionCountOrderByAggregateInput
    _avg?: CustomerSubscriptionAvgOrderByAggregateInput
    _max?: CustomerSubscriptionMaxOrderByAggregateInput
    _min?: CustomerSubscriptionMinOrderByAggregateInput
    _sum?: CustomerSubscriptionSumOrderByAggregateInput
  }

  export type CustomerSubscriptionScalarWhereWithAggregatesInput = {
    AND?: CustomerSubscriptionScalarWhereWithAggregatesInput | CustomerSubscriptionScalarWhereWithAggregatesInput[]
    OR?: CustomerSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: CustomerSubscriptionScalarWhereWithAggregatesInput | CustomerSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CustomerSubscription"> | string
    companyId?: IntWithAggregatesFilter<"CustomerSubscription"> | number
    planId?: StringWithAggregatesFilter<"CustomerSubscription"> | string
    status?: EnumSubscriptionStatusWithAggregatesFilter<"CustomerSubscription"> | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalWithAggregatesFilter<"CustomerSubscription"> | $Enums.BillingInterval
    stripeCustomerId?: StringNullableWithAggregatesFilter<"CustomerSubscription"> | string | null
    stripeSubscriptionId?: StringNullableWithAggregatesFilter<"CustomerSubscription"> | string | null
    cancellationDetails?: StringNullableWithAggregatesFilter<"CustomerSubscription"> | string | null
    currentPeriodStart?: DateTimeNullableWithAggregatesFilter<"CustomerSubscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableWithAggregatesFilter<"CustomerSubscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolWithAggregatesFilter<"CustomerSubscription"> | boolean
    trialStart?: DateTimeNullableWithAggregatesFilter<"CustomerSubscription"> | Date | string | null
    trialEnd?: DateTimeNullableWithAggregatesFilter<"CustomerSubscription"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CustomerSubscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CustomerSubscription"> | Date | string
  }

  export type UsageTrackingWhereInput = {
    AND?: UsageTrackingWhereInput | UsageTrackingWhereInput[]
    OR?: UsageTrackingWhereInput[]
    NOT?: UsageTrackingWhereInput | UsageTrackingWhereInput[]
    id?: StringFilter<"UsageTracking"> | string
    companyId?: IntFilter<"UsageTracking"> | number
    subscriptionId?: StringFilter<"UsageTracking"> | string
    metricType?: EnumUsageMetricTypeFilter<"UsageTracking"> | $Enums.UsageMetricType
    currentUsage?: IntFilter<"UsageTracking"> | number
    limitValue?: IntFilter<"UsageTracking"> | number
    periodStart?: DateTimeFilter<"UsageTracking"> | Date | string
    periodEnd?: DateTimeFilter<"UsageTracking"> | Date | string
    lastResetDate?: DateTimeNullableFilter<"UsageTracking"> | Date | string | null
    lastUpdated?: DateTimeFilter<"UsageTracking"> | Date | string
    createdAt?: DateTimeFilter<"UsageTracking"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    subscription?: XOR<CustomerSubscriptionScalarRelationFilter, CustomerSubscriptionWhereInput>
  }

  export type UsageTrackingOrderByWithRelationInput = {
    id?: SortOrder
    companyId?: SortOrder
    subscriptionId?: SortOrder
    metricType?: SortOrder
    currentUsage?: SortOrder
    limitValue?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    lastResetDate?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    company?: CompanyOrderByWithRelationInput
    subscription?: CustomerSubscriptionOrderByWithRelationInput
  }

  export type UsageTrackingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    companyId_metricType_periodStart?: UsageTrackingCompanyIdMetricTypePeriodStartCompoundUniqueInput
    AND?: UsageTrackingWhereInput | UsageTrackingWhereInput[]
    OR?: UsageTrackingWhereInput[]
    NOT?: UsageTrackingWhereInput | UsageTrackingWhereInput[]
    companyId?: IntFilter<"UsageTracking"> | number
    subscriptionId?: StringFilter<"UsageTracking"> | string
    metricType?: EnumUsageMetricTypeFilter<"UsageTracking"> | $Enums.UsageMetricType
    currentUsage?: IntFilter<"UsageTracking"> | number
    limitValue?: IntFilter<"UsageTracking"> | number
    periodStart?: DateTimeFilter<"UsageTracking"> | Date | string
    periodEnd?: DateTimeFilter<"UsageTracking"> | Date | string
    lastResetDate?: DateTimeNullableFilter<"UsageTracking"> | Date | string | null
    lastUpdated?: DateTimeFilter<"UsageTracking"> | Date | string
    createdAt?: DateTimeFilter<"UsageTracking"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    subscription?: XOR<CustomerSubscriptionScalarRelationFilter, CustomerSubscriptionWhereInput>
  }, "id" | "companyId_metricType_periodStart">

  export type UsageTrackingOrderByWithAggregationInput = {
    id?: SortOrder
    companyId?: SortOrder
    subscriptionId?: SortOrder
    metricType?: SortOrder
    currentUsage?: SortOrder
    limitValue?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    lastResetDate?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
    _count?: UsageTrackingCountOrderByAggregateInput
    _avg?: UsageTrackingAvgOrderByAggregateInput
    _max?: UsageTrackingMaxOrderByAggregateInput
    _min?: UsageTrackingMinOrderByAggregateInput
    _sum?: UsageTrackingSumOrderByAggregateInput
  }

  export type UsageTrackingScalarWhereWithAggregatesInput = {
    AND?: UsageTrackingScalarWhereWithAggregatesInput | UsageTrackingScalarWhereWithAggregatesInput[]
    OR?: UsageTrackingScalarWhereWithAggregatesInput[]
    NOT?: UsageTrackingScalarWhereWithAggregatesInput | UsageTrackingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UsageTracking"> | string
    companyId?: IntWithAggregatesFilter<"UsageTracking"> | number
    subscriptionId?: StringWithAggregatesFilter<"UsageTracking"> | string
    metricType?: EnumUsageMetricTypeWithAggregatesFilter<"UsageTracking"> | $Enums.UsageMetricType
    currentUsage?: IntWithAggregatesFilter<"UsageTracking"> | number
    limitValue?: IntWithAggregatesFilter<"UsageTracking"> | number
    periodStart?: DateTimeWithAggregatesFilter<"UsageTracking"> | Date | string
    periodEnd?: DateTimeWithAggregatesFilter<"UsageTracking"> | Date | string
    lastResetDate?: DateTimeNullableWithAggregatesFilter<"UsageTracking"> | Date | string | null
    lastUpdated?: DateTimeWithAggregatesFilter<"UsageTracking"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"UsageTracking"> | Date | string
  }

  export type UserCreateInput = {
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberCreateNestedManyWithoutUserInput
    avatar?: FileCreateNestedOneWithoutAvatarForInput
    company?: CompanyCreateNestedOneWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarId?: string | null
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    defaultCompanyId?: number | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUpdateManyWithoutUserNestedInput
    avatar?: FileUpdateOneWithoutAvatarForNestedInput
    company?: CompanyUpdateOneWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarId?: NullableStringFieldUpdateOperationsInput | string | null
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    defaultCompanyId?: NullableIntFieldUpdateOperationsInput | number | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarId?: string | null
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    defaultCompanyId?: number | null
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarId?: NullableStringFieldUpdateOperationsInput | string | null
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    defaultCompanyId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type FileCreateInput = {
    id?: string
    name: string
    url: string
    publicId?: string | null
    format?: string | null
    version?: string | null
    mimeType?: string | null
    size?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarFor?: UserCreateNestedManyWithoutAvatarInput
    user?: UserCreateNestedOneWithoutFilesInput
  }

  export type FileUncheckedCreateInput = {
    id?: string
    name: string
    url: string
    publicId?: string | null
    format?: string | null
    version?: string | null
    mimeType?: string | null
    size?: number | null
    userId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarFor?: UserUncheckedCreateNestedManyWithoutAvatarInput
  }

  export type FileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    version?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarFor?: UserUpdateManyWithoutAvatarNestedInput
    user?: UserUpdateOneWithoutFilesNestedInput
  }

  export type FileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    version?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarFor?: UserUncheckedUpdateManyWithoutAvatarNestedInput
  }

  export type FileCreateManyInput = {
    id?: string
    name: string
    url: string
    publicId?: string | null
    format?: string | null
    version?: string | null
    mimeType?: string | null
    size?: number | null
    userId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    version?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    version?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: number
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: number
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: number
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: number
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyCreateInput = {
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: CompanyMemberCreateNestedManyWithoutCompanyInput
    user?: UserCreateNestedManyWithoutCompanyInput
    CustomerSubscription?: CustomerSubscriptionCreateNestedManyWithoutCompanyInput
    UsageTracking?: UsageTrackingCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    id?: number
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput
    user?: UserUncheckedCreateNestedManyWithoutCompanyInput
    CustomerSubscription?: CustomerSubscriptionUncheckedCreateNestedManyWithoutCompanyInput
    UsageTracking?: UsageTrackingUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: CompanyMemberUpdateManyWithoutCompanyNestedInput
    user?: UserUpdateManyWithoutCompanyNestedInput
    CustomerSubscription?: CustomerSubscriptionUpdateManyWithoutCompanyNestedInput
    UsageTracking?: UsageTrackingUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: CompanyMemberUncheckedUpdateManyWithoutCompanyNestedInput
    user?: UserUncheckedUpdateManyWithoutCompanyNestedInput
    CustomerSubscription?: CustomerSubscriptionUncheckedUpdateManyWithoutCompanyNestedInput
    UsageTracking?: UsageTrackingUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    id?: number
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CompanyUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyMemberCreateInput = {
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutMembersInput
    user: UserCreateNestedOneWithoutCompanyMembersInput
  }

  export type CompanyMemberUncheckedCreateInput = {
    id?: number
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: number
    companyId: number
  }

  export type CompanyMemberUpdateInput = {
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneRequiredWithoutCompanyMembersNestedInput
  }

  export type CompanyMemberUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: IntFieldUpdateOperationsInput | number
    companyId?: IntFieldUpdateOperationsInput | number
  }

  export type CompanyMemberCreateManyInput = {
    id?: number
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: number
    companyId: number
  }

  export type CompanyMemberUpdateManyMutationInput = {
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyMemberUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: IntFieldUpdateOperationsInput | number
    companyId?: IntFieldUpdateOperationsInput | number
  }

  export type SubscriptionPlanCreateInput = {
    id?: string
    planType: $Enums.PlanType
    stripeProductId?: string | null
    stripePriceIdMonthly?: string | null
    stripePriceIdYearly?: string | null
    priceMonthly?: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string
    currency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: CustomerSubscriptionCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanUncheckedCreateInput = {
    id?: string
    planType: $Enums.PlanType
    stripeProductId?: string | null
    stripePriceIdMonthly?: string | null
    stripePriceIdYearly?: string | null
    priceMonthly?: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string
    currency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    subscriptions?: CustomerSubscriptionUncheckedCreateNestedManyWithoutPlanInput
  }

  export type SubscriptionPlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdMonthly?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdYearly?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: CustomerSubscriptionUpdateManyWithoutPlanNestedInput
  }

  export type SubscriptionPlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdMonthly?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdYearly?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: CustomerSubscriptionUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type SubscriptionPlanCreateManyInput = {
    id?: string
    planType: $Enums.PlanType
    stripeProductId?: string | null
    stripePriceIdMonthly?: string | null
    stripePriceIdYearly?: string | null
    priceMonthly?: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string
    currency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionPlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdMonthly?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdYearly?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdMonthly?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdYearly?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerSubscriptionCreateInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutCustomerSubscriptionInput
    plan: SubscriptionPlanCreateNestedOneWithoutSubscriptionsInput
    usageTracking?: UsageTrackingCreateNestedManyWithoutSubscriptionInput
  }

  export type CustomerSubscriptionUncheckedCreateInput = {
    id?: string
    companyId: number
    planId: string
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    usageTracking?: UsageTrackingUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type CustomerSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutCustomerSubscriptionNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutSubscriptionsNestedInput
    usageTracking?: UsageTrackingUpdateManyWithoutSubscriptionNestedInput
  }

  export type CustomerSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usageTracking?: UsageTrackingUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type CustomerSubscriptionCreateManyInput = {
    id?: string
    companyId: number
    planId: string
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageTrackingCreateInput = {
    id?: string
    metricType: $Enums.UsageMetricType
    currentUsage?: number
    limitValue: number
    periodStart?: Date | string
    periodEnd: Date | string
    lastResetDate?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
    company: CompanyCreateNestedOneWithoutUsageTrackingInput
    subscription: CustomerSubscriptionCreateNestedOneWithoutUsageTrackingInput
  }

  export type UsageTrackingUncheckedCreateInput = {
    id?: string
    companyId: number
    subscriptionId: string
    metricType: $Enums.UsageMetricType
    currentUsage?: number
    limitValue: number
    periodStart?: Date | string
    periodEnd: Date | string
    lastResetDate?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type UsageTrackingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutUsageTrackingNestedInput
    subscription?: CustomerSubscriptionUpdateOneRequiredWithoutUsageTrackingNestedInput
  }

  export type UsageTrackingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    subscriptionId?: StringFieldUpdateOperationsInput | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageTrackingCreateManyInput = {
    id?: string
    companyId: number
    subscriptionId: string
    metricType: $Enums.UsageMetricType
    currentUsage?: number
    limitValue: number
    periodStart?: Date | string
    periodEnd: Date | string
    lastResetDate?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type UsageTrackingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageTrackingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    subscriptionId?: StringFieldUpdateOperationsInput | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.Provider | EnumProviderFieldRefInput<$PrismaModel>
    in?: $Enums.Provider[] | ListEnumProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Provider[] | ListEnumProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumProviderFilter<$PrismaModel> | $Enums.Provider
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

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type EnumLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageFilter<$PrismaModel> | $Enums.Language
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

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumThemeFilter<$PrismaModel = never> = {
    equals?: $Enums.Theme | EnumThemeFieldRefInput<$PrismaModel>
    in?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    not?: NestedEnumThemeFilter<$PrismaModel> | $Enums.Theme
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type CompanyMemberListRelationFilter = {
    every?: CompanyMemberWhereInput
    some?: CompanyMemberWhereInput
    none?: CompanyMemberWhereInput
  }

  export type FileNullableScalarRelationFilter = {
    is?: FileWhereInput | null
    isNot?: FileWhereInput | null
  }

  export type CompanyNullableScalarRelationFilter = {
    is?: CompanyWhereInput | null
    isNot?: CompanyWhereInput | null
  }

  export type FileListRelationFilter = {
    every?: FileWhereInput
    some?: FileWhereInput
    none?: FileWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    password?: SortOrder
    resetPasswordToken?: SortOrder
    confirmationToken?: SortOrder
    confirmed?: SortOrder
    blocked?: SortOrder
    phone?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    position?: SortOrder
    companyName?: SortOrder
    country?: SortOrder
    linkedinUrl?: SortOrder
    twitterUrl?: SortOrder
    websiteUrl?: SortOrder
    githubUrl?: SortOrder
    avatarUrl?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    avatarId?: SortOrder
    idProvider?: SortOrder
    resetPasswordExpires?: SortOrder
    theme?: SortOrder
    defaultCompanyId?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    defaultCompanyId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    password?: SortOrder
    resetPasswordToken?: SortOrder
    confirmationToken?: SortOrder
    confirmed?: SortOrder
    blocked?: SortOrder
    phone?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    position?: SortOrder
    companyName?: SortOrder
    country?: SortOrder
    linkedinUrl?: SortOrder
    twitterUrl?: SortOrder
    websiteUrl?: SortOrder
    githubUrl?: SortOrder
    avatarUrl?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    avatarId?: SortOrder
    idProvider?: SortOrder
    resetPasswordExpires?: SortOrder
    theme?: SortOrder
    defaultCompanyId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    password?: SortOrder
    resetPasswordToken?: SortOrder
    confirmationToken?: SortOrder
    confirmed?: SortOrder
    blocked?: SortOrder
    phone?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    position?: SortOrder
    companyName?: SortOrder
    country?: SortOrder
    linkedinUrl?: SortOrder
    twitterUrl?: SortOrder
    websiteUrl?: SortOrder
    githubUrl?: SortOrder
    avatarUrl?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    avatarId?: SortOrder
    idProvider?: SortOrder
    resetPasswordExpires?: SortOrder
    theme?: SortOrder
    defaultCompanyId?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    defaultCompanyId?: SortOrder
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

  export type EnumProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Provider | EnumProviderFieldRefInput<$PrismaModel>
    in?: $Enums.Provider[] | ListEnumProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Provider[] | ListEnumProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumProviderWithAggregatesFilter<$PrismaModel> | $Enums.Provider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProviderFilter<$PrismaModel>
    _max?: NestedEnumProviderFilter<$PrismaModel>
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

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageWithAggregatesFilter<$PrismaModel> | $Enums.Language
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLanguageFilter<$PrismaModel>
    _max?: NestedEnumLanguageFilter<$PrismaModel>
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

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumThemeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Theme | EnumThemeFieldRefInput<$PrismaModel>
    in?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    not?: NestedEnumThemeWithAggregatesFilter<$PrismaModel> | $Enums.Theme
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumThemeFilter<$PrismaModel>
    _max?: NestedEnumThemeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FileCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    format?: SortOrder
    version?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileAvgOrderByAggregateInput = {
    size?: SortOrder
    userId?: SortOrder
  }

  export type FileMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    format?: SortOrder
    version?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    publicId?: SortOrder
    format?: SortOrder
    version?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FileSumOrderByAggregateInput = {
    size?: SortOrder
    userId?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    userId?: SortOrder
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    userId?: SortOrder
    expires_at?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type CustomerSubscriptionListRelationFilter = {
    every?: CustomerSubscriptionWhereInput
    some?: CustomerSubscriptionWhereInput
    none?: CustomerSubscriptionWhereInput
  }

  export type UsageTrackingListRelationFilter = {
    every?: UsageTrackingWhereInput
    some?: UsageTrackingWhereInput
    none?: UsageTrackingWhereInput
  }

  export type CustomerSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsageTrackingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    tokenApi?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    tokenApi?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    tokenApi?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CompanySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumCompanyMemberStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CompanyMemberStatus | EnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CompanyMemberStatus[] | ListEnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompanyMemberStatus[] | ListEnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCompanyMemberStatusFilter<$PrismaModel> | $Enums.CompanyMemberStatus
  }

  export type CompanyScalarRelationFilter = {
    is?: CompanyWhereInput
    isNot?: CompanyWhereInput
  }

  export type CompanyMemberUserIdCompanyIdCompoundUniqueInput = {
    userId: number
    companyId: number
  }

  export type CompanyMemberCountOrderByAggregateInput = {
    id?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    canApprove?: SortOrder
    isOwner?: SortOrder
    companyMemberStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    companyId?: SortOrder
  }

  export type CompanyMemberAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    companyId?: SortOrder
  }

  export type CompanyMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    canApprove?: SortOrder
    isOwner?: SortOrder
    companyMemberStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    companyId?: SortOrder
  }

  export type CompanyMemberMinOrderByAggregateInput = {
    id?: SortOrder
    isAdmin?: SortOrder
    canPost?: SortOrder
    canApprove?: SortOrder
    isOwner?: SortOrder
    companyMemberStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    companyId?: SortOrder
  }

  export type CompanyMemberSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    companyId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumCompanyMemberStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompanyMemberStatus | EnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CompanyMemberStatus[] | ListEnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompanyMemberStatus[] | ListEnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCompanyMemberStatusWithAggregatesFilter<$PrismaModel> | $Enums.CompanyMemberStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCompanyMemberStatusFilter<$PrismaModel>
    _max?: NestedEnumCompanyMemberStatusFilter<$PrismaModel>
  }

  export type EnumPlanTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeFilter<$PrismaModel> | $Enums.PlanType
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type SubscriptionPlanCountOrderByAggregateInput = {
    id?: SortOrder
    planType?: SortOrder
    stripeProductId?: SortOrder
    stripePriceIdMonthly?: SortOrder
    stripePriceIdYearly?: SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    currency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionPlanAvgOrderByAggregateInput = {
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
  }

  export type SubscriptionPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    planType?: SortOrder
    stripeProductId?: SortOrder
    stripePriceIdMonthly?: SortOrder
    stripePriceIdYearly?: SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    currency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionPlanMinOrderByAggregateInput = {
    id?: SortOrder
    planType?: SortOrder
    stripeProductId?: SortOrder
    stripePriceIdMonthly?: SortOrder
    stripePriceIdYearly?: SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    currency?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionPlanSumOrderByAggregateInput = {
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
  }

  export type EnumPlanTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel> | $Enums.PlanType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTypeFilter<$PrismaModel>
    _max?: NestedEnumPlanTypeFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type EnumBillingIntervalFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInterval | EnumBillingIntervalFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingIntervalFilter<$PrismaModel> | $Enums.BillingInterval
  }

  export type SubscriptionPlanScalarRelationFilter = {
    is?: SubscriptionPlanWhereInput
    isNot?: SubscriptionPlanWhereInput
  }

  export type CustomerSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingInterval?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    cancellationDetails?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    trialStart?: SortOrder
    trialEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerSubscriptionAvgOrderByAggregateInput = {
    companyId?: SortOrder
  }

  export type CustomerSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingInterval?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    cancellationDetails?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    trialStart?: SortOrder
    trialEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingInterval?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    cancellationDetails?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    cancelAtPeriodEnd?: SortOrder
    trialStart?: SortOrder
    trialEnd?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomerSubscriptionSumOrderByAggregateInput = {
    companyId?: SortOrder
  }

  export type EnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type EnumBillingIntervalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInterval | EnumBillingIntervalFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingIntervalWithAggregatesFilter<$PrismaModel> | $Enums.BillingInterval
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingIntervalFilter<$PrismaModel>
    _max?: NestedEnumBillingIntervalFilter<$PrismaModel>
  }

  export type EnumUsageMetricTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.UsageMetricType | EnumUsageMetricTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UsageMetricType[] | ListEnumUsageMetricTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UsageMetricType[] | ListEnumUsageMetricTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUsageMetricTypeFilter<$PrismaModel> | $Enums.UsageMetricType
  }

  export type CustomerSubscriptionScalarRelationFilter = {
    is?: CustomerSubscriptionWhereInput
    isNot?: CustomerSubscriptionWhereInput
  }

  export type UsageTrackingCompanyIdMetricTypePeriodStartCompoundUniqueInput = {
    companyId: number
    metricType: $Enums.UsageMetricType
    periodStart: Date | string
  }

  export type UsageTrackingCountOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    subscriptionId?: SortOrder
    metricType?: SortOrder
    currentUsage?: SortOrder
    limitValue?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    lastResetDate?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageTrackingAvgOrderByAggregateInput = {
    companyId?: SortOrder
    currentUsage?: SortOrder
    limitValue?: SortOrder
  }

  export type UsageTrackingMaxOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    subscriptionId?: SortOrder
    metricType?: SortOrder
    currentUsage?: SortOrder
    limitValue?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    lastResetDate?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageTrackingMinOrderByAggregateInput = {
    id?: SortOrder
    companyId?: SortOrder
    subscriptionId?: SortOrder
    metricType?: SortOrder
    currentUsage?: SortOrder
    limitValue?: SortOrder
    periodStart?: SortOrder
    periodEnd?: SortOrder
    lastResetDate?: SortOrder
    lastUpdated?: SortOrder
    createdAt?: SortOrder
  }

  export type UsageTrackingSumOrderByAggregateInput = {
    companyId?: SortOrder
    currentUsage?: SortOrder
    limitValue?: SortOrder
  }

  export type EnumUsageMetricTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UsageMetricType | EnumUsageMetricTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UsageMetricType[] | ListEnumUsageMetricTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UsageMetricType[] | ListEnumUsageMetricTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUsageMetricTypeWithAggregatesFilter<$PrismaModel> | $Enums.UsageMetricType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUsageMetricTypeFilter<$PrismaModel>
    _max?: NestedEnumUsageMetricTypeFilter<$PrismaModel>
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type CompanyMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<CompanyMemberCreateWithoutUserInput, CompanyMemberUncheckedCreateWithoutUserInput> | CompanyMemberCreateWithoutUserInput[] | CompanyMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutUserInput | CompanyMemberCreateOrConnectWithoutUserInput[]
    createMany?: CompanyMemberCreateManyUserInputEnvelope
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
  }

  export type FileCreateNestedOneWithoutAvatarForInput = {
    create?: XOR<FileCreateWithoutAvatarForInput, FileUncheckedCreateWithoutAvatarForInput>
    connectOrCreate?: FileCreateOrConnectWithoutAvatarForInput
    connect?: FileWhereUniqueInput
  }

  export type CompanyCreateNestedOneWithoutUserInput = {
    create?: XOR<CompanyCreateWithoutUserInput, CompanyUncheckedCreateWithoutUserInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUserInput
    connect?: CompanyWhereUniqueInput
  }

  export type FileCreateNestedManyWithoutUserInput = {
    create?: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput> | FileCreateWithoutUserInput[] | FileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[]
    createMany?: FileCreateManyUserInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type CompanyMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CompanyMemberCreateWithoutUserInput, CompanyMemberUncheckedCreateWithoutUserInput> | CompanyMemberCreateWithoutUserInput[] | CompanyMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutUserInput | CompanyMemberCreateOrConnectWithoutUserInput[]
    createMany?: CompanyMemberCreateManyUserInputEnvelope
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
  }

  export type FileUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput> | FileCreateWithoutUserInput[] | FileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[]
    createMany?: FileCreateManyUserInputEnvelope
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumProviderFieldUpdateOperationsInput = {
    set?: $Enums.Provider
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type EnumLanguageFieldUpdateOperationsInput = {
    set?: $Enums.Language
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumThemeFieldUpdateOperationsInput = {
    set?: $Enums.Theme
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
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

  export type FileUpdateOneWithoutAvatarForNestedInput = {
    create?: XOR<FileCreateWithoutAvatarForInput, FileUncheckedCreateWithoutAvatarForInput>
    connectOrCreate?: FileCreateOrConnectWithoutAvatarForInput
    upsert?: FileUpsertWithoutAvatarForInput
    disconnect?: FileWhereInput | boolean
    delete?: FileWhereInput | boolean
    connect?: FileWhereUniqueInput
    update?: XOR<XOR<FileUpdateToOneWithWhereWithoutAvatarForInput, FileUpdateWithoutAvatarForInput>, FileUncheckedUpdateWithoutAvatarForInput>
  }

  export type CompanyUpdateOneWithoutUserNestedInput = {
    create?: XOR<CompanyCreateWithoutUserInput, CompanyUncheckedCreateWithoutUserInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUserInput
    upsert?: CompanyUpsertWithoutUserInput
    disconnect?: CompanyWhereInput | boolean
    delete?: CompanyWhereInput | boolean
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutUserInput, CompanyUpdateWithoutUserInput>, CompanyUncheckedUpdateWithoutUserInput>
  }

  export type FileUpdateManyWithoutUserNestedInput = {
    create?: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput> | FileCreateWithoutUserInput[] | FileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutUserInput | FileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FileCreateManyUserInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutUserInput | FileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FileUpdateManyWithWhereWithoutUserInput | FileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
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

  export type FileUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput> | FileCreateWithoutUserInput[] | FileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FileCreateOrConnectWithoutUserInput | FileCreateOrConnectWithoutUserInput[]
    upsert?: FileUpsertWithWhereUniqueWithoutUserInput | FileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FileCreateManyUserInputEnvelope
    set?: FileWhereUniqueInput | FileWhereUniqueInput[]
    disconnect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    delete?: FileWhereUniqueInput | FileWhereUniqueInput[]
    connect?: FileWhereUniqueInput | FileWhereUniqueInput[]
    update?: FileUpdateWithWhereUniqueWithoutUserInput | FileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FileUpdateManyWithWhereWithoutUserInput | FileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FileScalarWhereInput | FileScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutAvatarInput = {
    create?: XOR<UserCreateWithoutAvatarInput, UserUncheckedCreateWithoutAvatarInput> | UserCreateWithoutAvatarInput[] | UserUncheckedCreateWithoutAvatarInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAvatarInput | UserCreateOrConnectWithoutAvatarInput[]
    createMany?: UserCreateManyAvatarInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutFilesInput = {
    create?: XOR<UserCreateWithoutFilesInput, UserUncheckedCreateWithoutFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutFilesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUncheckedCreateNestedManyWithoutAvatarInput = {
    create?: XOR<UserCreateWithoutAvatarInput, UserUncheckedCreateWithoutAvatarInput> | UserCreateWithoutAvatarInput[] | UserUncheckedCreateWithoutAvatarInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAvatarInput | UserCreateOrConnectWithoutAvatarInput[]
    createMany?: UserCreateManyAvatarInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutAvatarNestedInput = {
    create?: XOR<UserCreateWithoutAvatarInput, UserUncheckedCreateWithoutAvatarInput> | UserCreateWithoutAvatarInput[] | UserUncheckedCreateWithoutAvatarInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAvatarInput | UserCreateOrConnectWithoutAvatarInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutAvatarInput | UserUpsertWithWhereUniqueWithoutAvatarInput[]
    createMany?: UserCreateManyAvatarInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutAvatarInput | UserUpdateWithWhereUniqueWithoutAvatarInput[]
    updateMany?: UserUpdateManyWithWhereWithoutAvatarInput | UserUpdateManyWithWhereWithoutAvatarInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUpdateOneWithoutFilesNestedInput = {
    create?: XOR<UserCreateWithoutFilesInput, UserUncheckedCreateWithoutFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutFilesInput
    upsert?: UserUpsertWithoutFilesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFilesInput, UserUpdateWithoutFilesInput>, UserUncheckedUpdateWithoutFilesInput>
  }

  export type UserUncheckedUpdateManyWithoutAvatarNestedInput = {
    create?: XOR<UserCreateWithoutAvatarInput, UserUncheckedCreateWithoutAvatarInput> | UserCreateWithoutAvatarInput[] | UserUncheckedCreateWithoutAvatarInput[]
    connectOrCreate?: UserCreateOrConnectWithoutAvatarInput | UserCreateOrConnectWithoutAvatarInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutAvatarInput | UserUpsertWithWhereUniqueWithoutAvatarInput[]
    createMany?: UserCreateManyAvatarInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutAvatarInput | UserUpdateWithWhereUniqueWithoutAvatarInput[]
    updateMany?: UserUpdateManyWithWhereWithoutAvatarInput | UserUpdateManyWithWhereWithoutAvatarInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type CompanyMemberCreateNestedManyWithoutCompanyInput = {
    create?: XOR<CompanyMemberCreateWithoutCompanyInput, CompanyMemberUncheckedCreateWithoutCompanyInput> | CompanyMemberCreateWithoutCompanyInput[] | CompanyMemberUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutCompanyInput | CompanyMemberCreateOrConnectWithoutCompanyInput[]
    createMany?: CompanyMemberCreateManyCompanyInputEnvelope
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutCompanyInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type CustomerSubscriptionCreateNestedManyWithoutCompanyInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutCompanyInput, CustomerSubscriptionUncheckedCreateWithoutCompanyInput> | CustomerSubscriptionCreateWithoutCompanyInput[] | CustomerSubscriptionUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutCompanyInput | CustomerSubscriptionCreateOrConnectWithoutCompanyInput[]
    createMany?: CustomerSubscriptionCreateManyCompanyInputEnvelope
    connect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
  }

  export type UsageTrackingCreateNestedManyWithoutCompanyInput = {
    create?: XOR<UsageTrackingCreateWithoutCompanyInput, UsageTrackingUncheckedCreateWithoutCompanyInput> | UsageTrackingCreateWithoutCompanyInput[] | UsageTrackingUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UsageTrackingCreateOrConnectWithoutCompanyInput | UsageTrackingCreateOrConnectWithoutCompanyInput[]
    createMany?: UsageTrackingCreateManyCompanyInputEnvelope
    connect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
  }

  export type CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<CompanyMemberCreateWithoutCompanyInput, CompanyMemberUncheckedCreateWithoutCompanyInput> | CompanyMemberCreateWithoutCompanyInput[] | CompanyMemberUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CompanyMemberCreateOrConnectWithoutCompanyInput | CompanyMemberCreateOrConnectWithoutCompanyInput[]
    createMany?: CompanyMemberCreateManyCompanyInputEnvelope
    connect?: CompanyMemberWhereUniqueInput | CompanyMemberWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type CustomerSubscriptionUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutCompanyInput, CustomerSubscriptionUncheckedCreateWithoutCompanyInput> | CustomerSubscriptionCreateWithoutCompanyInput[] | CustomerSubscriptionUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutCompanyInput | CustomerSubscriptionCreateOrConnectWithoutCompanyInput[]
    createMany?: CustomerSubscriptionCreateManyCompanyInputEnvelope
    connect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
  }

  export type UsageTrackingUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<UsageTrackingCreateWithoutCompanyInput, UsageTrackingUncheckedCreateWithoutCompanyInput> | UsageTrackingCreateWithoutCompanyInput[] | UsageTrackingUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UsageTrackingCreateOrConnectWithoutCompanyInput | UsageTrackingCreateOrConnectWithoutCompanyInput[]
    createMany?: UsageTrackingCreateManyCompanyInputEnvelope
    connect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
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

  export type CustomerSubscriptionUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutCompanyInput, CustomerSubscriptionUncheckedCreateWithoutCompanyInput> | CustomerSubscriptionCreateWithoutCompanyInput[] | CustomerSubscriptionUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutCompanyInput | CustomerSubscriptionCreateOrConnectWithoutCompanyInput[]
    upsert?: CustomerSubscriptionUpsertWithWhereUniqueWithoutCompanyInput | CustomerSubscriptionUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: CustomerSubscriptionCreateManyCompanyInputEnvelope
    set?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    disconnect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    delete?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    connect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    update?: CustomerSubscriptionUpdateWithWhereUniqueWithoutCompanyInput | CustomerSubscriptionUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: CustomerSubscriptionUpdateManyWithWhereWithoutCompanyInput | CustomerSubscriptionUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: CustomerSubscriptionScalarWhereInput | CustomerSubscriptionScalarWhereInput[]
  }

  export type UsageTrackingUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<UsageTrackingCreateWithoutCompanyInput, UsageTrackingUncheckedCreateWithoutCompanyInput> | UsageTrackingCreateWithoutCompanyInput[] | UsageTrackingUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UsageTrackingCreateOrConnectWithoutCompanyInput | UsageTrackingCreateOrConnectWithoutCompanyInput[]
    upsert?: UsageTrackingUpsertWithWhereUniqueWithoutCompanyInput | UsageTrackingUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: UsageTrackingCreateManyCompanyInputEnvelope
    set?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    disconnect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    delete?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    connect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    update?: UsageTrackingUpdateWithWhereUniqueWithoutCompanyInput | UsageTrackingUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: UsageTrackingUpdateManyWithWhereWithoutCompanyInput | UsageTrackingUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: UsageTrackingScalarWhereInput | UsageTrackingScalarWhereInput[]
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

  export type CustomerSubscriptionUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutCompanyInput, CustomerSubscriptionUncheckedCreateWithoutCompanyInput> | CustomerSubscriptionCreateWithoutCompanyInput[] | CustomerSubscriptionUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutCompanyInput | CustomerSubscriptionCreateOrConnectWithoutCompanyInput[]
    upsert?: CustomerSubscriptionUpsertWithWhereUniqueWithoutCompanyInput | CustomerSubscriptionUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: CustomerSubscriptionCreateManyCompanyInputEnvelope
    set?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    disconnect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    delete?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    connect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    update?: CustomerSubscriptionUpdateWithWhereUniqueWithoutCompanyInput | CustomerSubscriptionUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: CustomerSubscriptionUpdateManyWithWhereWithoutCompanyInput | CustomerSubscriptionUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: CustomerSubscriptionScalarWhereInput | CustomerSubscriptionScalarWhereInput[]
  }

  export type UsageTrackingUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<UsageTrackingCreateWithoutCompanyInput, UsageTrackingUncheckedCreateWithoutCompanyInput> | UsageTrackingCreateWithoutCompanyInput[] | UsageTrackingUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UsageTrackingCreateOrConnectWithoutCompanyInput | UsageTrackingCreateOrConnectWithoutCompanyInput[]
    upsert?: UsageTrackingUpsertWithWhereUniqueWithoutCompanyInput | UsageTrackingUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: UsageTrackingCreateManyCompanyInputEnvelope
    set?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    disconnect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    delete?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    connect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    update?: UsageTrackingUpdateWithWhereUniqueWithoutCompanyInput | UsageTrackingUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: UsageTrackingUpdateManyWithWhereWithoutCompanyInput | UsageTrackingUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: UsageTrackingScalarWhereInput | UsageTrackingScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutMembersInput = {
    create?: XOR<CompanyCreateWithoutMembersInput, CompanyUncheckedCreateWithoutMembersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutMembersInput
    connect?: CompanyWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCompanyMembersInput = {
    create?: XOR<UserCreateWithoutCompanyMembersInput, UserUncheckedCreateWithoutCompanyMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutCompanyMembersInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumCompanyMemberStatusFieldUpdateOperationsInput = {
    set?: $Enums.CompanyMemberStatus
  }

  export type CompanyUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<CompanyCreateWithoutMembersInput, CompanyUncheckedCreateWithoutMembersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutMembersInput
    upsert?: CompanyUpsertWithoutMembersInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutMembersInput, CompanyUpdateWithoutMembersInput>, CompanyUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneRequiredWithoutCompanyMembersNestedInput = {
    create?: XOR<UserCreateWithoutCompanyMembersInput, UserUncheckedCreateWithoutCompanyMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutCompanyMembersInput
    upsert?: UserUpsertWithoutCompanyMembersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCompanyMembersInput, UserUpdateWithoutCompanyMembersInput>, UserUncheckedUpdateWithoutCompanyMembersInput>
  }

  export type CustomerSubscriptionCreateNestedManyWithoutPlanInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutPlanInput, CustomerSubscriptionUncheckedCreateWithoutPlanInput> | CustomerSubscriptionCreateWithoutPlanInput[] | CustomerSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutPlanInput | CustomerSubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: CustomerSubscriptionCreateManyPlanInputEnvelope
    connect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
  }

  export type CustomerSubscriptionUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutPlanInput, CustomerSubscriptionUncheckedCreateWithoutPlanInput> | CustomerSubscriptionCreateWithoutPlanInput[] | CustomerSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutPlanInput | CustomerSubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: CustomerSubscriptionCreateManyPlanInputEnvelope
    connect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
  }

  export type EnumPlanTypeFieldUpdateOperationsInput = {
    set?: $Enums.PlanType
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type CustomerSubscriptionUpdateManyWithoutPlanNestedInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutPlanInput, CustomerSubscriptionUncheckedCreateWithoutPlanInput> | CustomerSubscriptionCreateWithoutPlanInput[] | CustomerSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutPlanInput | CustomerSubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: CustomerSubscriptionUpsertWithWhereUniqueWithoutPlanInput | CustomerSubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: CustomerSubscriptionCreateManyPlanInputEnvelope
    set?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    disconnect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    delete?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    connect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    update?: CustomerSubscriptionUpdateWithWhereUniqueWithoutPlanInput | CustomerSubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: CustomerSubscriptionUpdateManyWithWhereWithoutPlanInput | CustomerSubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: CustomerSubscriptionScalarWhereInput | CustomerSubscriptionScalarWhereInput[]
  }

  export type CustomerSubscriptionUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutPlanInput, CustomerSubscriptionUncheckedCreateWithoutPlanInput> | CustomerSubscriptionCreateWithoutPlanInput[] | CustomerSubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutPlanInput | CustomerSubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: CustomerSubscriptionUpsertWithWhereUniqueWithoutPlanInput | CustomerSubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: CustomerSubscriptionCreateManyPlanInputEnvelope
    set?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    disconnect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    delete?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    connect?: CustomerSubscriptionWhereUniqueInput | CustomerSubscriptionWhereUniqueInput[]
    update?: CustomerSubscriptionUpdateWithWhereUniqueWithoutPlanInput | CustomerSubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: CustomerSubscriptionUpdateManyWithWhereWithoutPlanInput | CustomerSubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: CustomerSubscriptionScalarWhereInput | CustomerSubscriptionScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutCustomerSubscriptionInput = {
    create?: XOR<CompanyCreateWithoutCustomerSubscriptionInput, CompanyUncheckedCreateWithoutCustomerSubscriptionInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutCustomerSubscriptionInput
    connect?: CompanyWhereUniqueInput
  }

  export type SubscriptionPlanCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<SubscriptionPlanCreateWithoutSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutSubscriptionsInput
    connect?: SubscriptionPlanWhereUniqueInput
  }

  export type UsageTrackingCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<UsageTrackingCreateWithoutSubscriptionInput, UsageTrackingUncheckedCreateWithoutSubscriptionInput> | UsageTrackingCreateWithoutSubscriptionInput[] | UsageTrackingUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: UsageTrackingCreateOrConnectWithoutSubscriptionInput | UsageTrackingCreateOrConnectWithoutSubscriptionInput[]
    createMany?: UsageTrackingCreateManySubscriptionInputEnvelope
    connect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
  }

  export type UsageTrackingUncheckedCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<UsageTrackingCreateWithoutSubscriptionInput, UsageTrackingUncheckedCreateWithoutSubscriptionInput> | UsageTrackingCreateWithoutSubscriptionInput[] | UsageTrackingUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: UsageTrackingCreateOrConnectWithoutSubscriptionInput | UsageTrackingCreateOrConnectWithoutSubscriptionInput[]
    createMany?: UsageTrackingCreateManySubscriptionInputEnvelope
    connect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
  }

  export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus
  }

  export type EnumBillingIntervalFieldUpdateOperationsInput = {
    set?: $Enums.BillingInterval
  }

  export type CompanyUpdateOneRequiredWithoutCustomerSubscriptionNestedInput = {
    create?: XOR<CompanyCreateWithoutCustomerSubscriptionInput, CompanyUncheckedCreateWithoutCustomerSubscriptionInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutCustomerSubscriptionInput
    upsert?: CompanyUpsertWithoutCustomerSubscriptionInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutCustomerSubscriptionInput, CompanyUpdateWithoutCustomerSubscriptionInput>, CompanyUncheckedUpdateWithoutCustomerSubscriptionInput>
  }

  export type SubscriptionPlanUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<SubscriptionPlanCreateWithoutSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: SubscriptionPlanCreateOrConnectWithoutSubscriptionsInput
    upsert?: SubscriptionPlanUpsertWithoutSubscriptionsInput
    connect?: SubscriptionPlanWhereUniqueInput
    update?: XOR<XOR<SubscriptionPlanUpdateToOneWithWhereWithoutSubscriptionsInput, SubscriptionPlanUpdateWithoutSubscriptionsInput>, SubscriptionPlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type UsageTrackingUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<UsageTrackingCreateWithoutSubscriptionInput, UsageTrackingUncheckedCreateWithoutSubscriptionInput> | UsageTrackingCreateWithoutSubscriptionInput[] | UsageTrackingUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: UsageTrackingCreateOrConnectWithoutSubscriptionInput | UsageTrackingCreateOrConnectWithoutSubscriptionInput[]
    upsert?: UsageTrackingUpsertWithWhereUniqueWithoutSubscriptionInput | UsageTrackingUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: UsageTrackingCreateManySubscriptionInputEnvelope
    set?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    disconnect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    delete?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    connect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    update?: UsageTrackingUpdateWithWhereUniqueWithoutSubscriptionInput | UsageTrackingUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: UsageTrackingUpdateManyWithWhereWithoutSubscriptionInput | UsageTrackingUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: UsageTrackingScalarWhereInput | UsageTrackingScalarWhereInput[]
  }

  export type UsageTrackingUncheckedUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<UsageTrackingCreateWithoutSubscriptionInput, UsageTrackingUncheckedCreateWithoutSubscriptionInput> | UsageTrackingCreateWithoutSubscriptionInput[] | UsageTrackingUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: UsageTrackingCreateOrConnectWithoutSubscriptionInput | UsageTrackingCreateOrConnectWithoutSubscriptionInput[]
    upsert?: UsageTrackingUpsertWithWhereUniqueWithoutSubscriptionInput | UsageTrackingUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: UsageTrackingCreateManySubscriptionInputEnvelope
    set?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    disconnect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    delete?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    connect?: UsageTrackingWhereUniqueInput | UsageTrackingWhereUniqueInput[]
    update?: UsageTrackingUpdateWithWhereUniqueWithoutSubscriptionInput | UsageTrackingUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: UsageTrackingUpdateManyWithWhereWithoutSubscriptionInput | UsageTrackingUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: UsageTrackingScalarWhereInput | UsageTrackingScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutUsageTrackingInput = {
    create?: XOR<CompanyCreateWithoutUsageTrackingInput, CompanyUncheckedCreateWithoutUsageTrackingInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUsageTrackingInput
    connect?: CompanyWhereUniqueInput
  }

  export type CustomerSubscriptionCreateNestedOneWithoutUsageTrackingInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutUsageTrackingInput, CustomerSubscriptionUncheckedCreateWithoutUsageTrackingInput>
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutUsageTrackingInput
    connect?: CustomerSubscriptionWhereUniqueInput
  }

  export type EnumUsageMetricTypeFieldUpdateOperationsInput = {
    set?: $Enums.UsageMetricType
  }

  export type CompanyUpdateOneRequiredWithoutUsageTrackingNestedInput = {
    create?: XOR<CompanyCreateWithoutUsageTrackingInput, CompanyUncheckedCreateWithoutUsageTrackingInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUsageTrackingInput
    upsert?: CompanyUpsertWithoutUsageTrackingInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutUsageTrackingInput, CompanyUpdateWithoutUsageTrackingInput>, CompanyUncheckedUpdateWithoutUsageTrackingInput>
  }

  export type CustomerSubscriptionUpdateOneRequiredWithoutUsageTrackingNestedInput = {
    create?: XOR<CustomerSubscriptionCreateWithoutUsageTrackingInput, CustomerSubscriptionUncheckedCreateWithoutUsageTrackingInput>
    connectOrCreate?: CustomerSubscriptionCreateOrConnectWithoutUsageTrackingInput
    upsert?: CustomerSubscriptionUpsertWithoutUsageTrackingInput
    connect?: CustomerSubscriptionWhereUniqueInput
    update?: XOR<XOR<CustomerSubscriptionUpdateToOneWithWhereWithoutUsageTrackingInput, CustomerSubscriptionUpdateWithoutUsageTrackingInput>, CustomerSubscriptionUncheckedUpdateWithoutUsageTrackingInput>
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

  export type NestedEnumProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.Provider | EnumProviderFieldRefInput<$PrismaModel>
    in?: $Enums.Provider[] | ListEnumProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Provider[] | ListEnumProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumProviderFilter<$PrismaModel> | $Enums.Provider
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedEnumLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageFilter<$PrismaModel> | $Enums.Language
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

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumThemeFilter<$PrismaModel = never> = {
    equals?: $Enums.Theme | EnumThemeFieldRefInput<$PrismaModel>
    in?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    not?: NestedEnumThemeFilter<$PrismaModel> | $Enums.Theme
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

  export type NestedEnumProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Provider | EnumProviderFieldRefInput<$PrismaModel>
    in?: $Enums.Provider[] | ListEnumProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.Provider[] | ListEnumProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumProviderWithAggregatesFilter<$PrismaModel> | $Enums.Provider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProviderFilter<$PrismaModel>
    _max?: NestedEnumProviderFilter<$PrismaModel>
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

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageWithAggregatesFilter<$PrismaModel> | $Enums.Language
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLanguageFilter<$PrismaModel>
    _max?: NestedEnumLanguageFilter<$PrismaModel>
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

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumThemeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Theme | EnumThemeFieldRefInput<$PrismaModel>
    in?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    notIn?: $Enums.Theme[] | ListEnumThemeFieldRefInput<$PrismaModel>
    not?: NestedEnumThemeWithAggregatesFilter<$PrismaModel> | $Enums.Theme
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumThemeFilter<$PrismaModel>
    _max?: NestedEnumThemeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumCompanyMemberStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CompanyMemberStatus | EnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CompanyMemberStatus[] | ListEnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompanyMemberStatus[] | ListEnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCompanyMemberStatusFilter<$PrismaModel> | $Enums.CompanyMemberStatus
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumCompanyMemberStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CompanyMemberStatus | EnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.CompanyMemberStatus[] | ListEnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.CompanyMemberStatus[] | ListEnumCompanyMemberStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumCompanyMemberStatusWithAggregatesFilter<$PrismaModel> | $Enums.CompanyMemberStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCompanyMemberStatusFilter<$PrismaModel>
    _max?: NestedEnumCompanyMemberStatusFilter<$PrismaModel>
  }

  export type NestedEnumPlanTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeFilter<$PrismaModel> | $Enums.PlanType
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel> | $Enums.PlanType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTypeFilter<$PrismaModel>
    _max?: NestedEnumPlanTypeFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type NestedEnumBillingIntervalFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInterval | EnumBillingIntervalFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingIntervalFilter<$PrismaModel> | $Enums.BillingInterval
  }

  export type NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type NestedEnumBillingIntervalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BillingInterval | EnumBillingIntervalFieldRefInput<$PrismaModel>
    in?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    notIn?: $Enums.BillingInterval[] | ListEnumBillingIntervalFieldRefInput<$PrismaModel>
    not?: NestedEnumBillingIntervalWithAggregatesFilter<$PrismaModel> | $Enums.BillingInterval
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBillingIntervalFilter<$PrismaModel>
    _max?: NestedEnumBillingIntervalFilter<$PrismaModel>
  }

  export type NestedEnumUsageMetricTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.UsageMetricType | EnumUsageMetricTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UsageMetricType[] | ListEnumUsageMetricTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UsageMetricType[] | ListEnumUsageMetricTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUsageMetricTypeFilter<$PrismaModel> | $Enums.UsageMetricType
  }

  export type NestedEnumUsageMetricTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UsageMetricType | EnumUsageMetricTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UsageMetricType[] | ListEnumUsageMetricTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UsageMetricType[] | ListEnumUsageMetricTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUsageMetricTypeWithAggregatesFilter<$PrismaModel> | $Enums.UsageMetricType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUsageMetricTypeFilter<$PrismaModel>
    _max?: NestedEnumUsageMetricTypeFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CompanyMemberCreateWithoutUserInput = {
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutMembersInput
  }

  export type CompanyMemberUncheckedCreateWithoutUserInput = {
    id?: number
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    companyId: number
  }

  export type CompanyMemberCreateOrConnectWithoutUserInput = {
    where: CompanyMemberWhereUniqueInput
    create: XOR<CompanyMemberCreateWithoutUserInput, CompanyMemberUncheckedCreateWithoutUserInput>
  }

  export type CompanyMemberCreateManyUserInputEnvelope = {
    data: CompanyMemberCreateManyUserInput | CompanyMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FileCreateWithoutAvatarForInput = {
    id?: string
    name: string
    url: string
    publicId?: string | null
    format?: string | null
    version?: string | null
    mimeType?: string | null
    size?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutFilesInput
  }

  export type FileUncheckedCreateWithoutAvatarForInput = {
    id?: string
    name: string
    url: string
    publicId?: string | null
    format?: string | null
    version?: string | null
    mimeType?: string | null
    size?: number | null
    userId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FileCreateOrConnectWithoutAvatarForInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutAvatarForInput, FileUncheckedCreateWithoutAvatarForInput>
  }

  export type CompanyCreateWithoutUserInput = {
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: CompanyMemberCreateNestedManyWithoutCompanyInput
    CustomerSubscription?: CustomerSubscriptionCreateNestedManyWithoutCompanyInput
    UsageTracking?: UsageTrackingCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutUserInput = {
    id?: number
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput
    CustomerSubscription?: CustomerSubscriptionUncheckedCreateNestedManyWithoutCompanyInput
    UsageTracking?: UsageTrackingUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutUserInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutUserInput, CompanyUncheckedCreateWithoutUserInput>
  }

  export type FileCreateWithoutUserInput = {
    id?: string
    name: string
    url: string
    publicId?: string | null
    format?: string | null
    version?: string | null
    mimeType?: string | null
    size?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarFor?: UserCreateNestedManyWithoutAvatarInput
  }

  export type FileUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    url: string
    publicId?: string | null
    format?: string | null
    version?: string | null
    mimeType?: string | null
    size?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarFor?: UserUncheckedCreateNestedManyWithoutAvatarInput
  }

  export type FileCreateOrConnectWithoutUserInput = {
    where: FileWhereUniqueInput
    create: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>
  }

  export type FileCreateManyUserInputEnvelope = {
    data: FileCreateManyUserInput | FileCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: IntFilter<"Account"> | number
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: IntFilter<"Session"> | number
    expires?: DateTimeFilter<"Session"> | Date | string
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
    id?: IntFilter<"CompanyMember"> | number
    isAdmin?: BoolFilter<"CompanyMember"> | boolean
    canPost?: BoolFilter<"CompanyMember"> | boolean
    canApprove?: BoolFilter<"CompanyMember"> | boolean
    isOwner?: BoolFilter<"CompanyMember"> | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFilter<"CompanyMember"> | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFilter<"CompanyMember"> | Date | string
    updatedAt?: DateTimeFilter<"CompanyMember"> | Date | string
    userId?: IntFilter<"CompanyMember"> | number
    companyId?: IntFilter<"CompanyMember"> | number
  }

  export type FileUpsertWithoutAvatarForInput = {
    update: XOR<FileUpdateWithoutAvatarForInput, FileUncheckedUpdateWithoutAvatarForInput>
    create: XOR<FileCreateWithoutAvatarForInput, FileUncheckedCreateWithoutAvatarForInput>
    where?: FileWhereInput
  }

  export type FileUpdateToOneWithWhereWithoutAvatarForInput = {
    where?: FileWhereInput
    data: XOR<FileUpdateWithoutAvatarForInput, FileUncheckedUpdateWithoutAvatarForInput>
  }

  export type FileUpdateWithoutAvatarForInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    version?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutFilesNestedInput
  }

  export type FileUncheckedUpdateWithoutAvatarForInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    version?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUpsertWithoutUserInput = {
    update: XOR<CompanyUpdateWithoutUserInput, CompanyUncheckedUpdateWithoutUserInput>
    create: XOR<CompanyCreateWithoutUserInput, CompanyUncheckedCreateWithoutUserInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutUserInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutUserInput, CompanyUncheckedUpdateWithoutUserInput>
  }

  export type CompanyUpdateWithoutUserInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: CompanyMemberUpdateManyWithoutCompanyNestedInput
    CustomerSubscription?: CustomerSubscriptionUpdateManyWithoutCompanyNestedInput
    UsageTracking?: UsageTrackingUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: CompanyMemberUncheckedUpdateManyWithoutCompanyNestedInput
    CustomerSubscription?: CustomerSubscriptionUncheckedUpdateManyWithoutCompanyNestedInput
    UsageTracking?: UsageTrackingUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type FileUpsertWithWhereUniqueWithoutUserInput = {
    where: FileWhereUniqueInput
    update: XOR<FileUpdateWithoutUserInput, FileUncheckedUpdateWithoutUserInput>
    create: XOR<FileCreateWithoutUserInput, FileUncheckedCreateWithoutUserInput>
  }

  export type FileUpdateWithWhereUniqueWithoutUserInput = {
    where: FileWhereUniqueInput
    data: XOR<FileUpdateWithoutUserInput, FileUncheckedUpdateWithoutUserInput>
  }

  export type FileUpdateManyWithWhereWithoutUserInput = {
    where: FileScalarWhereInput
    data: XOR<FileUpdateManyMutationInput, FileUncheckedUpdateManyWithoutUserInput>
  }

  export type FileScalarWhereInput = {
    AND?: FileScalarWhereInput | FileScalarWhereInput[]
    OR?: FileScalarWhereInput[]
    NOT?: FileScalarWhereInput | FileScalarWhereInput[]
    id?: StringFilter<"File"> | string
    name?: StringFilter<"File"> | string
    url?: StringFilter<"File"> | string
    publicId?: StringNullableFilter<"File"> | string | null
    format?: StringNullableFilter<"File"> | string | null
    version?: StringNullableFilter<"File"> | string | null
    mimeType?: StringNullableFilter<"File"> | string | null
    size?: IntNullableFilter<"File"> | number | null
    userId?: IntNullableFilter<"File"> | number | null
    createdAt?: DateTimeFilter<"File"> | Date | string
    updatedAt?: DateTimeFilter<"File"> | Date | string
  }

  export type UserCreateWithoutAvatarInput = {
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberCreateNestedManyWithoutUserInput
    company?: CompanyCreateNestedOneWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAvatarInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    defaultCompanyId?: number | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAvatarInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAvatarInput, UserUncheckedCreateWithoutAvatarInput>
  }

  export type UserCreateManyAvatarInputEnvelope = {
    data: UserCreateManyAvatarInput | UserCreateManyAvatarInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutFilesInput = {
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberCreateNestedManyWithoutUserInput
    avatar?: FileCreateNestedOneWithoutAvatarForInput
    company?: CompanyCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFilesInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarId?: string | null
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    defaultCompanyId?: number | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFilesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFilesInput, UserUncheckedCreateWithoutFilesInput>
  }

  export type UserUpsertWithWhereUniqueWithoutAvatarInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutAvatarInput, UserUncheckedUpdateWithoutAvatarInput>
    create: XOR<UserCreateWithoutAvatarInput, UserUncheckedCreateWithoutAvatarInput>
  }

  export type UserUpdateWithWhereUniqueWithoutAvatarInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutAvatarInput, UserUncheckedUpdateWithoutAvatarInput>
  }

  export type UserUpdateManyWithWhereWithoutAvatarInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutAvatarInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    provider?: EnumProviderFilter<"User"> | $Enums.Provider
    password?: StringNullableFilter<"User"> | string | null
    resetPasswordToken?: StringNullableFilter<"User"> | string | null
    confirmationToken?: StringNullableFilter<"User"> | string | null
    confirmed?: BoolNullableFilter<"User"> | boolean | null
    blocked?: BoolNullableFilter<"User"> | boolean | null
    phone?: StringNullableFilter<"User"> | string | null
    firstName?: StringFilter<"User"> | string
    lastName?: StringNullableFilter<"User"> | string | null
    position?: StringNullableFilter<"User"> | string | null
    companyName?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    linkedinUrl?: StringNullableFilter<"User"> | string | null
    twitterUrl?: StringNullableFilter<"User"> | string | null
    websiteUrl?: StringNullableFilter<"User"> | string | null
    githubUrl?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    language?: EnumLanguageFilter<"User"> | $Enums.Language
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    avatarId?: StringNullableFilter<"User"> | string | null
    idProvider?: StringNullableFilter<"User"> | string | null
    resetPasswordExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    theme?: EnumThemeFilter<"User"> | $Enums.Theme
    defaultCompanyId?: IntNullableFilter<"User"> | number | null
  }

  export type UserUpsertWithoutFilesInput = {
    update: XOR<UserUpdateWithoutFilesInput, UserUncheckedUpdateWithoutFilesInput>
    create: XOR<UserCreateWithoutFilesInput, UserUncheckedCreateWithoutFilesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFilesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFilesInput, UserUncheckedUpdateWithoutFilesInput>
  }

  export type UserUpdateWithoutFilesInput = {
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUpdateManyWithoutUserNestedInput
    avatar?: FileUpdateOneWithoutAvatarForNestedInput
    company?: CompanyUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFilesInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarId?: NullableStringFieldUpdateOperationsInput | string | null
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    defaultCompanyId?: NullableIntFieldUpdateOperationsInput | number | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    sessions?: SessionCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberCreateNestedManyWithoutUserInput
    avatar?: FileCreateNestedOneWithoutAvatarForInput
    company?: CompanyCreateNestedOneWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarId?: string | null
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    defaultCompanyId?: number | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    sessions?: SessionUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUpdateManyWithoutUserNestedInput
    avatar?: FileUpdateOneWithoutAvatarForNestedInput
    company?: CompanyUpdateOneWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarId?: NullableStringFieldUpdateOperationsInput | string | null
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    defaultCompanyId?: NullableIntFieldUpdateOperationsInput | number | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    accounts?: AccountCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberCreateNestedManyWithoutUserInput
    avatar?: FileCreateNestedOneWithoutAvatarForInput
    company?: CompanyCreateNestedOneWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarId?: string | null
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    defaultCompanyId?: number | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    accounts?: AccountUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUpdateManyWithoutUserNestedInput
    avatar?: FileUpdateOneWithoutAvatarForNestedInput
    company?: CompanyUpdateOneWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarId?: NullableStringFieldUpdateOperationsInput | string | null
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    defaultCompanyId?: NullableIntFieldUpdateOperationsInput | number | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CompanyMemberCreateWithoutCompanyInput = {
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCompanyMembersInput
  }

  export type CompanyMemberUncheckedCreateWithoutCompanyInput = {
    id?: number
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: number
  }

  export type CompanyMemberCreateOrConnectWithoutCompanyInput = {
    where: CompanyMemberWhereUniqueInput
    create: XOR<CompanyMemberCreateWithoutCompanyInput, CompanyMemberUncheckedCreateWithoutCompanyInput>
  }

  export type CompanyMemberCreateManyCompanyInputEnvelope = {
    data: CompanyMemberCreateManyCompanyInput | CompanyMemberCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutCompanyInput = {
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberCreateNestedManyWithoutUserInput
    avatar?: FileCreateNestedOneWithoutAvatarForInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCompanyInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarId?: string | null
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    companyMembers?: CompanyMemberUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCompanyInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput>
  }

  export type UserCreateManyCompanyInputEnvelope = {
    data: UserCreateManyCompanyInput | UserCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type CustomerSubscriptionCreateWithoutCompanyInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: SubscriptionPlanCreateNestedOneWithoutSubscriptionsInput
    usageTracking?: UsageTrackingCreateNestedManyWithoutSubscriptionInput
  }

  export type CustomerSubscriptionUncheckedCreateWithoutCompanyInput = {
    id?: string
    planId: string
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    usageTracking?: UsageTrackingUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type CustomerSubscriptionCreateOrConnectWithoutCompanyInput = {
    where: CustomerSubscriptionWhereUniqueInput
    create: XOR<CustomerSubscriptionCreateWithoutCompanyInput, CustomerSubscriptionUncheckedCreateWithoutCompanyInput>
  }

  export type CustomerSubscriptionCreateManyCompanyInputEnvelope = {
    data: CustomerSubscriptionCreateManyCompanyInput | CustomerSubscriptionCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type UsageTrackingCreateWithoutCompanyInput = {
    id?: string
    metricType: $Enums.UsageMetricType
    currentUsage?: number
    limitValue: number
    periodStart?: Date | string
    periodEnd: Date | string
    lastResetDate?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
    subscription: CustomerSubscriptionCreateNestedOneWithoutUsageTrackingInput
  }

  export type UsageTrackingUncheckedCreateWithoutCompanyInput = {
    id?: string
    subscriptionId: string
    metricType: $Enums.UsageMetricType
    currentUsage?: number
    limitValue: number
    periodStart?: Date | string
    periodEnd: Date | string
    lastResetDate?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type UsageTrackingCreateOrConnectWithoutCompanyInput = {
    where: UsageTrackingWhereUniqueInput
    create: XOR<UsageTrackingCreateWithoutCompanyInput, UsageTrackingUncheckedCreateWithoutCompanyInput>
  }

  export type UsageTrackingCreateManyCompanyInputEnvelope = {
    data: UsageTrackingCreateManyCompanyInput | UsageTrackingCreateManyCompanyInput[]
    skipDuplicates?: boolean
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

  export type CustomerSubscriptionUpsertWithWhereUniqueWithoutCompanyInput = {
    where: CustomerSubscriptionWhereUniqueInput
    update: XOR<CustomerSubscriptionUpdateWithoutCompanyInput, CustomerSubscriptionUncheckedUpdateWithoutCompanyInput>
    create: XOR<CustomerSubscriptionCreateWithoutCompanyInput, CustomerSubscriptionUncheckedCreateWithoutCompanyInput>
  }

  export type CustomerSubscriptionUpdateWithWhereUniqueWithoutCompanyInput = {
    where: CustomerSubscriptionWhereUniqueInput
    data: XOR<CustomerSubscriptionUpdateWithoutCompanyInput, CustomerSubscriptionUncheckedUpdateWithoutCompanyInput>
  }

  export type CustomerSubscriptionUpdateManyWithWhereWithoutCompanyInput = {
    where: CustomerSubscriptionScalarWhereInput
    data: XOR<CustomerSubscriptionUpdateManyMutationInput, CustomerSubscriptionUncheckedUpdateManyWithoutCompanyInput>
  }

  export type CustomerSubscriptionScalarWhereInput = {
    AND?: CustomerSubscriptionScalarWhereInput | CustomerSubscriptionScalarWhereInput[]
    OR?: CustomerSubscriptionScalarWhereInput[]
    NOT?: CustomerSubscriptionScalarWhereInput | CustomerSubscriptionScalarWhereInput[]
    id?: StringFilter<"CustomerSubscription"> | string
    companyId?: IntFilter<"CustomerSubscription"> | number
    planId?: StringFilter<"CustomerSubscription"> | string
    status?: EnumSubscriptionStatusFilter<"CustomerSubscription"> | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFilter<"CustomerSubscription"> | $Enums.BillingInterval
    stripeCustomerId?: StringNullableFilter<"CustomerSubscription"> | string | null
    stripeSubscriptionId?: StringNullableFilter<"CustomerSubscription"> | string | null
    cancellationDetails?: StringNullableFilter<"CustomerSubscription"> | string | null
    currentPeriodStart?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    cancelAtPeriodEnd?: BoolFilter<"CustomerSubscription"> | boolean
    trialStart?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    trialEnd?: DateTimeNullableFilter<"CustomerSubscription"> | Date | string | null
    createdAt?: DateTimeFilter<"CustomerSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"CustomerSubscription"> | Date | string
  }

  export type UsageTrackingUpsertWithWhereUniqueWithoutCompanyInput = {
    where: UsageTrackingWhereUniqueInput
    update: XOR<UsageTrackingUpdateWithoutCompanyInput, UsageTrackingUncheckedUpdateWithoutCompanyInput>
    create: XOR<UsageTrackingCreateWithoutCompanyInput, UsageTrackingUncheckedCreateWithoutCompanyInput>
  }

  export type UsageTrackingUpdateWithWhereUniqueWithoutCompanyInput = {
    where: UsageTrackingWhereUniqueInput
    data: XOR<UsageTrackingUpdateWithoutCompanyInput, UsageTrackingUncheckedUpdateWithoutCompanyInput>
  }

  export type UsageTrackingUpdateManyWithWhereWithoutCompanyInput = {
    where: UsageTrackingScalarWhereInput
    data: XOR<UsageTrackingUpdateManyMutationInput, UsageTrackingUncheckedUpdateManyWithoutCompanyInput>
  }

  export type UsageTrackingScalarWhereInput = {
    AND?: UsageTrackingScalarWhereInput | UsageTrackingScalarWhereInput[]
    OR?: UsageTrackingScalarWhereInput[]
    NOT?: UsageTrackingScalarWhereInput | UsageTrackingScalarWhereInput[]
    id?: StringFilter<"UsageTracking"> | string
    companyId?: IntFilter<"UsageTracking"> | number
    subscriptionId?: StringFilter<"UsageTracking"> | string
    metricType?: EnumUsageMetricTypeFilter<"UsageTracking"> | $Enums.UsageMetricType
    currentUsage?: IntFilter<"UsageTracking"> | number
    limitValue?: IntFilter<"UsageTracking"> | number
    periodStart?: DateTimeFilter<"UsageTracking"> | Date | string
    periodEnd?: DateTimeFilter<"UsageTracking"> | Date | string
    lastResetDate?: DateTimeNullableFilter<"UsageTracking"> | Date | string | null
    lastUpdated?: DateTimeFilter<"UsageTracking"> | Date | string
    createdAt?: DateTimeFilter<"UsageTracking"> | Date | string
  }

  export type CompanyCreateWithoutMembersInput = {
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedManyWithoutCompanyInput
    CustomerSubscription?: CustomerSubscriptionCreateNestedManyWithoutCompanyInput
    UsageTracking?: UsageTrackingCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutMembersInput = {
    id?: number
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserUncheckedCreateNestedManyWithoutCompanyInput
    CustomerSubscription?: CustomerSubscriptionUncheckedCreateNestedManyWithoutCompanyInput
    UsageTracking?: UsageTrackingUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutMembersInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutMembersInput, CompanyUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutCompanyMembersInput = {
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    avatar?: FileCreateNestedOneWithoutAvatarForInput
    company?: CompanyCreateNestedOneWithoutUserInput
    files?: FileCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCompanyMembersInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarId?: string | null
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    defaultCompanyId?: number | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    files?: FileUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCompanyMembersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCompanyMembersInput, UserUncheckedCreateWithoutCompanyMembersInput>
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
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateManyWithoutCompanyNestedInput
    CustomerSubscription?: CustomerSubscriptionUpdateManyWithoutCompanyNestedInput
    UsageTracking?: UsageTrackingUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutMembersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUncheckedUpdateManyWithoutCompanyNestedInput
    CustomerSubscription?: CustomerSubscriptionUncheckedUpdateManyWithoutCompanyNestedInput
    UsageTracking?: UsageTrackingUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type UserUpsertWithoutCompanyMembersInput = {
    update: XOR<UserUpdateWithoutCompanyMembersInput, UserUncheckedUpdateWithoutCompanyMembersInput>
    create: XOR<UserCreateWithoutCompanyMembersInput, UserUncheckedCreateWithoutCompanyMembersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCompanyMembersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCompanyMembersInput, UserUncheckedUpdateWithoutCompanyMembersInput>
  }

  export type UserUpdateWithoutCompanyMembersInput = {
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    avatar?: FileUpdateOneWithoutAvatarForNestedInput
    company?: CompanyUpdateOneWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCompanyMembersInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarId?: NullableStringFieldUpdateOperationsInput | string | null
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    defaultCompanyId?: NullableIntFieldUpdateOperationsInput | number | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CustomerSubscriptionCreateWithoutPlanInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutCustomerSubscriptionInput
    usageTracking?: UsageTrackingCreateNestedManyWithoutSubscriptionInput
  }

  export type CustomerSubscriptionUncheckedCreateWithoutPlanInput = {
    id?: string
    companyId: number
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    usageTracking?: UsageTrackingUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type CustomerSubscriptionCreateOrConnectWithoutPlanInput = {
    where: CustomerSubscriptionWhereUniqueInput
    create: XOR<CustomerSubscriptionCreateWithoutPlanInput, CustomerSubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type CustomerSubscriptionCreateManyPlanInputEnvelope = {
    data: CustomerSubscriptionCreateManyPlanInput | CustomerSubscriptionCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type CustomerSubscriptionUpsertWithWhereUniqueWithoutPlanInput = {
    where: CustomerSubscriptionWhereUniqueInput
    update: XOR<CustomerSubscriptionUpdateWithoutPlanInput, CustomerSubscriptionUncheckedUpdateWithoutPlanInput>
    create: XOR<CustomerSubscriptionCreateWithoutPlanInput, CustomerSubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type CustomerSubscriptionUpdateWithWhereUniqueWithoutPlanInput = {
    where: CustomerSubscriptionWhereUniqueInput
    data: XOR<CustomerSubscriptionUpdateWithoutPlanInput, CustomerSubscriptionUncheckedUpdateWithoutPlanInput>
  }

  export type CustomerSubscriptionUpdateManyWithWhereWithoutPlanInput = {
    where: CustomerSubscriptionScalarWhereInput
    data: XOR<CustomerSubscriptionUpdateManyMutationInput, CustomerSubscriptionUncheckedUpdateManyWithoutPlanInput>
  }

  export type CompanyCreateWithoutCustomerSubscriptionInput = {
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: CompanyMemberCreateNestedManyWithoutCompanyInput
    user?: UserCreateNestedManyWithoutCompanyInput
    UsageTracking?: UsageTrackingCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutCustomerSubscriptionInput = {
    id?: number
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput
    user?: UserUncheckedCreateNestedManyWithoutCompanyInput
    UsageTracking?: UsageTrackingUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutCustomerSubscriptionInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutCustomerSubscriptionInput, CompanyUncheckedCreateWithoutCustomerSubscriptionInput>
  }

  export type SubscriptionPlanCreateWithoutSubscriptionsInput = {
    id?: string
    planType: $Enums.PlanType
    stripeProductId?: string | null
    stripePriceIdMonthly?: string | null
    stripePriceIdYearly?: string | null
    priceMonthly?: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string
    currency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    planType: $Enums.PlanType
    stripeProductId?: string | null
    stripePriceIdMonthly?: string | null
    stripePriceIdYearly?: string | null
    priceMonthly?: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string
    currency?: string
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionPlanCreateOrConnectWithoutSubscriptionsInput = {
    where: SubscriptionPlanWhereUniqueInput
    create: XOR<SubscriptionPlanCreateWithoutSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput>
  }

  export type UsageTrackingCreateWithoutSubscriptionInput = {
    id?: string
    metricType: $Enums.UsageMetricType
    currentUsage?: number
    limitValue: number
    periodStart?: Date | string
    periodEnd: Date | string
    lastResetDate?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
    company: CompanyCreateNestedOneWithoutUsageTrackingInput
  }

  export type UsageTrackingUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    companyId: number
    metricType: $Enums.UsageMetricType
    currentUsage?: number
    limitValue: number
    periodStart?: Date | string
    periodEnd: Date | string
    lastResetDate?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type UsageTrackingCreateOrConnectWithoutSubscriptionInput = {
    where: UsageTrackingWhereUniqueInput
    create: XOR<UsageTrackingCreateWithoutSubscriptionInput, UsageTrackingUncheckedCreateWithoutSubscriptionInput>
  }

  export type UsageTrackingCreateManySubscriptionInputEnvelope = {
    data: UsageTrackingCreateManySubscriptionInput | UsageTrackingCreateManySubscriptionInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithoutCustomerSubscriptionInput = {
    update: XOR<CompanyUpdateWithoutCustomerSubscriptionInput, CompanyUncheckedUpdateWithoutCustomerSubscriptionInput>
    create: XOR<CompanyCreateWithoutCustomerSubscriptionInput, CompanyUncheckedCreateWithoutCustomerSubscriptionInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutCustomerSubscriptionInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutCustomerSubscriptionInput, CompanyUncheckedUpdateWithoutCustomerSubscriptionInput>
  }

  export type CompanyUpdateWithoutCustomerSubscriptionInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: CompanyMemberUpdateManyWithoutCompanyNestedInput
    user?: UserUpdateManyWithoutCompanyNestedInput
    UsageTracking?: UsageTrackingUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutCustomerSubscriptionInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: CompanyMemberUncheckedUpdateManyWithoutCompanyNestedInput
    user?: UserUncheckedUpdateManyWithoutCompanyNestedInput
    UsageTracking?: UsageTrackingUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type SubscriptionPlanUpsertWithoutSubscriptionsInput = {
    update: XOR<SubscriptionPlanUpdateWithoutSubscriptionsInput, SubscriptionPlanUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<SubscriptionPlanCreateWithoutSubscriptionsInput, SubscriptionPlanUncheckedCreateWithoutSubscriptionsInput>
    where?: SubscriptionPlanWhereInput
  }

  export type SubscriptionPlanUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: SubscriptionPlanWhereInput
    data: XOR<SubscriptionPlanUpdateWithoutSubscriptionsInput, SubscriptionPlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type SubscriptionPlanUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdMonthly?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdYearly?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionPlanUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    planType?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    stripeProductId?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdMonthly?: NullableStringFieldUpdateOperationsInput | string | null
    stripePriceIdYearly?: NullableStringFieldUpdateOperationsInput | string | null
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageTrackingUpsertWithWhereUniqueWithoutSubscriptionInput = {
    where: UsageTrackingWhereUniqueInput
    update: XOR<UsageTrackingUpdateWithoutSubscriptionInput, UsageTrackingUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<UsageTrackingCreateWithoutSubscriptionInput, UsageTrackingUncheckedCreateWithoutSubscriptionInput>
  }

  export type UsageTrackingUpdateWithWhereUniqueWithoutSubscriptionInput = {
    where: UsageTrackingWhereUniqueInput
    data: XOR<UsageTrackingUpdateWithoutSubscriptionInput, UsageTrackingUncheckedUpdateWithoutSubscriptionInput>
  }

  export type UsageTrackingUpdateManyWithWhereWithoutSubscriptionInput = {
    where: UsageTrackingScalarWhereInput
    data: XOR<UsageTrackingUpdateManyMutationInput, UsageTrackingUncheckedUpdateManyWithoutSubscriptionInput>
  }

  export type CompanyCreateWithoutUsageTrackingInput = {
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: CompanyMemberCreateNestedManyWithoutCompanyInput
    user?: UserCreateNestedManyWithoutCompanyInput
    CustomerSubscription?: CustomerSubscriptionCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutUsageTrackingInput = {
    id?: number
    name: string
    description?: string | null
    tokenApi?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: CompanyMemberUncheckedCreateNestedManyWithoutCompanyInput
    user?: UserUncheckedCreateNestedManyWithoutCompanyInput
    CustomerSubscription?: CustomerSubscriptionUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutUsageTrackingInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutUsageTrackingInput, CompanyUncheckedCreateWithoutUsageTrackingInput>
  }

  export type CustomerSubscriptionCreateWithoutUsageTrackingInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    company: CompanyCreateNestedOneWithoutCustomerSubscriptionInput
    plan: SubscriptionPlanCreateNestedOneWithoutSubscriptionsInput
  }

  export type CustomerSubscriptionUncheckedCreateWithoutUsageTrackingInput = {
    id?: string
    companyId: number
    planId: string
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerSubscriptionCreateOrConnectWithoutUsageTrackingInput = {
    where: CustomerSubscriptionWhereUniqueInput
    create: XOR<CustomerSubscriptionCreateWithoutUsageTrackingInput, CustomerSubscriptionUncheckedCreateWithoutUsageTrackingInput>
  }

  export type CompanyUpsertWithoutUsageTrackingInput = {
    update: XOR<CompanyUpdateWithoutUsageTrackingInput, CompanyUncheckedUpdateWithoutUsageTrackingInput>
    create: XOR<CompanyCreateWithoutUsageTrackingInput, CompanyUncheckedCreateWithoutUsageTrackingInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutUsageTrackingInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutUsageTrackingInput, CompanyUncheckedUpdateWithoutUsageTrackingInput>
  }

  export type CompanyUpdateWithoutUsageTrackingInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: CompanyMemberUpdateManyWithoutCompanyNestedInput
    user?: UserUpdateManyWithoutCompanyNestedInput
    CustomerSubscription?: CustomerSubscriptionUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutUsageTrackingInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    tokenApi?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: CompanyMemberUncheckedUpdateManyWithoutCompanyNestedInput
    user?: UserUncheckedUpdateManyWithoutCompanyNestedInput
    CustomerSubscription?: CustomerSubscriptionUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CustomerSubscriptionUpsertWithoutUsageTrackingInput = {
    update: XOR<CustomerSubscriptionUpdateWithoutUsageTrackingInput, CustomerSubscriptionUncheckedUpdateWithoutUsageTrackingInput>
    create: XOR<CustomerSubscriptionCreateWithoutUsageTrackingInput, CustomerSubscriptionUncheckedCreateWithoutUsageTrackingInput>
    where?: CustomerSubscriptionWhereInput
  }

  export type CustomerSubscriptionUpdateToOneWithWhereWithoutUsageTrackingInput = {
    where?: CustomerSubscriptionWhereInput
    data: XOR<CustomerSubscriptionUpdateWithoutUsageTrackingInput, CustomerSubscriptionUncheckedUpdateWithoutUsageTrackingInput>
  }

  export type CustomerSubscriptionUpdateWithoutUsageTrackingInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutCustomerSubscriptionNestedInput
    plan?: SubscriptionPlanUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type CustomerSubscriptionUncheckedUpdateWithoutUsageTrackingInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type CompanyMemberCreateManyUserInput = {
    id?: number
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    companyId: number
  }

  export type FileCreateManyUserInput = {
    id?: string
    name: string
    url: string
    publicId?: string | null
    format?: string | null
    version?: string | null
    mimeType?: string | null
    size?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyMemberUpdateWithoutUserInput = {
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutMembersNestedInput
  }

  export type CompanyMemberUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: IntFieldUpdateOperationsInput | number
  }

  export type CompanyMemberUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    companyId?: IntFieldUpdateOperationsInput | number
  }

  export type FileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    version?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarFor?: UserUpdateManyWithoutAvatarNestedInput
  }

  export type FileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    version?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarFor?: UserUncheckedUpdateManyWithoutAvatarNestedInput
  }

  export type FileUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publicId?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    version?: NullableStringFieldUpdateOperationsInput | string | null
    mimeType?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyAvatarInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
    defaultCompanyId?: number | null
  }

  export type UserUpdateWithoutAvatarInput = {
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUpdateManyWithoutUserNestedInput
    company?: CompanyUpdateOneWithoutUserNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAvatarInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    defaultCompanyId?: NullableIntFieldUpdateOperationsInput | number | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutAvatarInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    defaultCompanyId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CompanyMemberCreateManyCompanyInput = {
    id?: number
    isAdmin: boolean
    canPost: boolean
    canApprove: boolean
    isOwner: boolean
    companyMemberStatus: $Enums.CompanyMemberStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: number
  }

  export type UserCreateManyCompanyInput = {
    id?: number
    email: string
    provider?: $Enums.Provider
    password?: string | null
    resetPasswordToken?: string | null
    confirmationToken?: string | null
    confirmed?: boolean | null
    blocked?: boolean | null
    phone?: string | null
    firstName: string
    lastName?: string | null
    position?: string | null
    companyName?: string | null
    country?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    websiteUrl?: string | null
    githubUrl?: string | null
    avatarUrl?: string | null
    language: $Enums.Language
    createdAt?: Date | string
    updatedAt?: Date | string
    avatarId?: string | null
    idProvider?: string | null
    resetPasswordExpires?: Date | string | null
    theme?: $Enums.Theme
  }

  export type CustomerSubscriptionCreateManyCompanyInput = {
    id?: string
    planId: string
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UsageTrackingCreateManyCompanyInput = {
    id?: string
    subscriptionId: string
    metricType: $Enums.UsageMetricType
    currentUsage?: number
    limitValue: number
    periodStart?: Date | string
    periodEnd: Date | string
    lastResetDate?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type CompanyMemberUpdateWithoutCompanyInput = {
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCompanyMembersNestedInput
  }

  export type CompanyMemberUncheckedUpdateWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type CompanyMemberUncheckedUpdateManyWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    canPost?: BoolFieldUpdateOperationsInput | boolean
    canApprove?: BoolFieldUpdateOperationsInput | boolean
    isOwner?: BoolFieldUpdateOperationsInput | boolean
    companyMemberStatus?: EnumCompanyMemberStatusFieldUpdateOperationsInput | $Enums.CompanyMemberStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: IntFieldUpdateOperationsInput | number
  }

  export type UserUpdateWithoutCompanyInput = {
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUpdateManyWithoutUserNestedInput
    avatar?: FileUpdateOneWithoutAvatarForNestedInput
    files?: FileUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarId?: NullableStringFieldUpdateOperationsInput | string | null
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    companyMembers?: CompanyMemberUncheckedUpdateManyWithoutUserNestedInput
    files?: FileUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    provider?: EnumProviderFieldUpdateOperationsInput | $Enums.Provider
    password?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationToken?: NullableStringFieldUpdateOperationsInput | string | null
    confirmed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    blocked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableStringFieldUpdateOperationsInput | string | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    linkedinUrl?: NullableStringFieldUpdateOperationsInput | string | null
    twitterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    websiteUrl?: NullableStringFieldUpdateOperationsInput | string | null
    githubUrl?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    language?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    avatarId?: NullableStringFieldUpdateOperationsInput | string | null
    idProvider?: NullableStringFieldUpdateOperationsInput | string | null
    resetPasswordExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    theme?: EnumThemeFieldUpdateOperationsInput | $Enums.Theme
  }

  export type CustomerSubscriptionUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: SubscriptionPlanUpdateOneRequiredWithoutSubscriptionsNestedInput
    usageTracking?: UsageTrackingUpdateManyWithoutSubscriptionNestedInput
  }

  export type CustomerSubscriptionUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usageTracking?: UsageTrackingUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type CustomerSubscriptionUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageTrackingUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: CustomerSubscriptionUpdateOneRequiredWithoutUsageTrackingNestedInput
  }

  export type UsageTrackingUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageTrackingUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: StringFieldUpdateOperationsInput | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerSubscriptionCreateManyPlanInput = {
    id?: string
    companyId: number
    status?: $Enums.SubscriptionStatus
    billingInterval?: $Enums.BillingInterval
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    cancellationDetails?: string | null
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    cancelAtPeriodEnd?: boolean
    trialStart?: Date | string | null
    trialEnd?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomerSubscriptionUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutCustomerSubscriptionNestedInput
    usageTracking?: UsageTrackingUpdateManyWithoutSubscriptionNestedInput
  }

  export type CustomerSubscriptionUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usageTracking?: UsageTrackingUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type CustomerSubscriptionUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    billingInterval?: EnumBillingIntervalFieldUpdateOperationsInput | $Enums.BillingInterval
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationDetails?: NullableStringFieldUpdateOperationsInput | string | null
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelAtPeriodEnd?: BoolFieldUpdateOperationsInput | boolean
    trialStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageTrackingCreateManySubscriptionInput = {
    id?: string
    companyId: number
    metricType: $Enums.UsageMetricType
    currentUsage?: number
    limitValue: number
    periodStart?: Date | string
    periodEnd: Date | string
    lastResetDate?: Date | string | null
    lastUpdated?: Date | string
    createdAt?: Date | string
  }

  export type UsageTrackingUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutUsageTrackingNestedInput
  }

  export type UsageTrackingUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageTrackingUncheckedUpdateManyWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyId?: IntFieldUpdateOperationsInput | number
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | $Enums.UsageMetricType
    currentUsage?: IntFieldUpdateOperationsInput | number
    limitValue?: IntFieldUpdateOperationsInput | number
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    periodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    lastResetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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