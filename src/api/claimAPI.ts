/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Error {
  /** @format int32 */
  code?: number;
  /** @example "Unexpected error" */
  message?: string;
}

export interface AirdropData {
  clam_status: AirdropDataClamStatusEnum;
  jetton: JettonInfo;
  /**
   * Admin`s wallet address
   * @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
   */
  admin: string;
  /**
   * Status of data readiness for airdrop
   * @example false
   */
  processed: boolean;
  /** royalty parameters for airdrop */
  royalty_parameters: RoyaltyParameters;
  /** @example "597968399" */
  total_amount?: string;
  /**
   * Total number of recipients
   * @format int32
   * @example 10000000
   */
  recipients?: number;
  /**
   * Number of distributor contracts
   * @format int32
   * @example 16
   */
  shards?: number;
  /**
   * Sha256 hash of uploaded CSV file
   * @example "97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
   */
  file_hash?: string;
  /**
   * Name of uploaded CSV file
   * @example "airdrop.csv"
   */
  file_name?: string;
  /**
   * True if the file is uploaded but not saved in the database
   * @example false
   */
  upload_in_progress?: boolean;
  /**
   * File upload error
   * @example "Address duplication error. Two identical recipient addresses in the file."
   */
  upload_error?: string;
}

/** royalty parameters for airdrop */
export interface RoyaltyParameters {
  /** @example "100000000" */
  min_commission: string;
}

export interface DistributorData {
  /**
   * Distributor contract address
   * @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
   */
  account: string;
  airdrop_status: DistributorDataAirdropStatusEnum;
  /**
   * Total airdrop amount
   * @example "597968399"
   */
  total_amount: string;
  /**
   * Total number of recipients
   * @format int32
   * @example 10000000
   */
  recipients: number;
  /**
   * Shard number of distributor contract
   * @format int32
   * @example 3
   */
  shard: number;
  deploy_message?: InternalMessage;
  top_up_message?: InternalMessage;
  ton_withdrawal_message?: InternalMessage;
  jetton_withdrawal_message?: InternalMessage;
  block_message?: InternalMessage;
  /**
   * Jettons to-up amount
   * @example "597968399"
   */
  need_jettons?: string;
  /**
   * Number of completed claims
   * @format int32
   * @example 10000000
   */
  completed_claims?: number;
  /**
   * Total claimed amount
   * @example "597968399"
   */
  claimed_amount?: string;
  /**
   * Accumulated commission (estimated, admin gets)
   * @example "597968399"
   */
  accumulated_commission?: string;
  /**
   * Jetton balance
   * @example "597968399"
   */
  jetton_balance?: string;
}

export interface RoyaltyData {
  /**
   * Distributor contract address
   * @example "0:97146a46acc2654y27947f14c4a4b14273e954f78bc017790b41208b0043200b"
   */
  account: string;
  /**
   * Shard number of distributor contract
   * @format int32
   * @example 3
   */
  shard: number;
  royalty_withdrawal_message?: InternalMessage;
  /**
   * Accumulated royalty (royalty receiver gets)
   * @default "0"
   * @example "597968399"
   */
  accumulated_royalty: string;
  /**
   * Total accumulated royalty (royalty receiver gets)
   * @default "0"
   * @example "597968399"
   */
  total_accumulated_royalty: string;
}

export interface InternalMessage {
  /**
   * Message sending mode
   * @format int32
   * @example 3
   */
  mode: number;
  /**
   * Destination address in user-friendly form with bounce flag
   * @example "kQABcHP_oXkYNCx3HHKd4rxL371RRl-O6IwgwqYZ7IT6Ha-u"
   */
  address: string;
  /** Message state init (base64 format) */
  state_init?: string;
  /** Message payload (base64 format) */
  payload: string;
  /**
   * TON attached amount
   * @example "597968399"
   */
  amount: string;
}

export interface JettonInfo {
  /**
   * @format address
   * @example "0:0BB5A9F69043EEBDDA5AD2E946EB953242BD8F603FE795D90698CEEC6BFC60A0"
   */
  address: string;
  /** @example "Wrapped TON" */
  name: string;
  /** @example "Wrapped Toncoin" */
  description?: string;
  /** @example "WTON" */
  symbol: string;
  /** @example "9" */
  decimals: string;
  /** @example "https://cache.tonapi.io/images/jetton.jpg" */
  preview: string;
}

export interface DistributorsData {
  /** List of distributor contracts */
  distributors: DistributorData[];
}

export interface RoyaltiesData {
  /** List of distributor`s royalty info */
  royalties: RoyaltyData[];
}

export interface UserClaim {
  claim_message: InternalMessage;
  /** @example "597968399" */
  amount: string;
}

export enum AirdropDataClamStatusEnum {
  Opened = "opened",
  Closed = "closed",
}

export enum DistributorDataAirdropStatusEnum {
  NotDeployed = "not_deployed",
  LackOfJettons = "lack_of_jettons",
  Ready = "ready",
  Blocked = "blocked",
}

export interface GetAirdropDataParams {
  /**
   * Airdrop ID
   * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
   */
  id: string;
}

export interface FileUploadParams {
  /**
   * Airdrop ID
   * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
   */
  id: string;
}

export interface GetDistributorsDataParams {
  /**
   * Airdrop ID
   * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
   */
  id: string;
}

export interface GetRoyaltyDataParams {
  /**
   * Airdrop ID
   * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
   */
  id: string;
}

export interface OpenClaimParams {
  /**
   * Airdrop ID
   * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
   */
  id: string;
}

export interface CloseClaimParams {
  /**
   * Airdrop ID
   * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
   */
  id: string;
}

export interface GetUserClaimParams {
  /**
   * Airdrop ID
   * @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b"
   */
  id: string;
  /**
   * Account
   * @example "0:da6b1b6663a0e4d18cc8574ccd9db5296e367dd9324706f3bbd9eb1cd2caf0bf"
   */
  account: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8888";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title Airdrop API for TON Console
 * @version 0.0.1
 * @baseUrl http://localhost:8888
 */
export class ClaimAPI<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  airdrop = {
    /**
     * No description
     *
     * @tags admin
     * @name GetAirdropData
     * @summary Get airdrop info
     * @request GET:/v1/airdrop
     */
    getAirdropData: (query: GetAirdropDataParams, params: RequestParams = {}) =>
      this.http.request<AirdropData, Error>({
        path: `/v1/airdrop`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name NewAirdrop
     * @summary Generate new airdrop
     * @request POST:/v1/airdrop
     */
    newAirdrop: (
      data: {
        /** claim admin wallet address */
        admin: string;
        /** jetton master contract address */
        jetton: string;
        /** royalty parameters for airdrop */
        royalty_parameters: RoyaltyParameters;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<
        {
          /** @example "03cfc582-b1c3-410a-a9a7-1f3afe326b3b" */
          id: string;
        },
        Error
      >({
        path: `/v1/airdrop`,
        method: "POST",
        body: data,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name FileUpload
     * @summary Upload withdrawals file
     * @request POST:/v1/airdrop/upload
     */
    fileUpload: (
      query: FileUploadParams,
      data: {
        /**
         * The CSV file to upload
         * @format binary
         */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, Error>({
        path: `/v1/airdrop/upload`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name GetDistributorsData
     * @summary Get distributors info
     * @request GET:/v1/airdrop/distributors
     */
    getDistributorsData: (query: GetDistributorsDataParams, params: RequestParams = {}) =>
      this.http.request<DistributorsData, Error>({
        path: `/v1/airdrop/distributors`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name GetRoyaltyData
     * @summary Get royalty info
     * @request GET:/v1/airdrop/royalty
     */
    getRoyaltyData: (query: GetRoyaltyDataParams, params: RequestParams = {}) =>
      this.http.request<RoyaltiesData, Error>({
        path: `/v1/airdrop/royalty`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name OpenClaim
     * @summary Open claim method for users
     * @request POST:/v1/airdrop/start
     */
    openClaim: (query: OpenClaimParams, params: RequestParams = {}) =>
      this.http.request<void, Error>({
        path: `/v1/airdrop/start`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags admin
     * @name CloseClaim
     * @summary Close claim method for users
     * @request POST:/v1/airdrop/stop
     */
    closeClaim: (query: CloseClaimParams, params: RequestParams = {}) =>
      this.http.request<void, Error>({
        path: `/v1/airdrop/stop`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags claim
     * @name GetUserClaim
     * @summary Get user claim data
     * @request GET:/v1/airdrop/claim/{account}
     */
    getUserClaim: ({ account, ...query }: GetUserClaimParams, params: RequestParams = {}) =>
      this.http.request<UserClaim, Error>({
        path: `/v1/airdrop/claim/${account}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
