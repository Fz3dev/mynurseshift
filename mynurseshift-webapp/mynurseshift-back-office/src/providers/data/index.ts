import { DataProvider } from "@refinedev/core";
import { axiosInstance } from "./axios";
import { stringify } from "query-string";

export const dataProvider = (apiUrl: string): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters }) => {
    const url = `${apiUrl}/${resource}`;

    const { current = 1, pageSize = 10 } = pagination ?? {};

    const queryFilters = filters?.reduce((acc, filter) => {
      acc[filter.field] = filter.value;
      return acc;
    }, {} as any);

    const query = {
      ...queryFilters,
      _start: (current - 1) * pageSize,
      _limit: pageSize,
      _sort: sorters?.map((sorter) => `${sorter.field}:${sorter.order}`).join(","),
    };

    const { data, headers } = await axiosInstance.get(`${url}?${stringify(query)}`);

    const total = +headers["x-total-count"];

    return {
      data,
      total: total || data.length,
    };
  },

  getMany: async ({ resource, ids }) => {
    const { data } = await axiosInstance.get(
      `${apiUrl}/${resource}?${stringify({ id: ids })}`,
    );

    return {
      data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}`;

    const { data } = await axiosInstance.post(url, variables);

    return {
      data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await axiosInstance.put(url, variables);

    return {
      data,
    };
  },

  getOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await axiosInstance.get(url);

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await axiosInstance.delete(url);

    return {
      data,
    };
  },

  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    let requestUrl = `${url}?`;

    if (filters) {
      const filterQuery = filters
        .map((filter) => `${filter.field}=${filter.value}`)
        .join("&");
      requestUrl = `${requestUrl}&${filterQuery}`;
    }

    if (sorters) {
      const sorterQuery = sorters
        .map((sorter) => `_sort=${sorter.field}:${sorter.order}`)
        .join("&");
      requestUrl = `${requestUrl}&${sorterQuery}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    if (headers) {
      axiosInstance.defaults.headers = {
        ...axiosInstance.defaults.headers,
        ...headers,
      };
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await axiosInstance[method](url, payload);
        break;
      case "delete":
        axiosResponse = await axiosInstance.delete(url);
        break;
      default:
        axiosResponse = await axiosInstance.get(requestUrl);
        break;
    }

    const { data } = axiosResponse;

    return { data };
  },
});
