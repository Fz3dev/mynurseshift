import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  notificationProvider,
  ErrorComponent,
} from "@refinedev/antd";
import routerBindings, {
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React from "react";

import { Login } from "./pages/auth/login";
import { Layout } from "./components/layout";
import { authProvider } from "./authProvider";
import { UserList, UserShow } from "./pages/users";
import { PoleList, PoleCreate, PoleEdit } from "./pages/poles";
import { ServiceList, ServiceCreate, ServiceEdit } from "./pages/services";

import "@refinedev/antd/dist/reset.css";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const auth = localStorage.getItem("auth");
  const token = auth ? JSON.parse(auth).token : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <RefineKbarProvider>
          <Refine
            authProvider={authProvider}
            routerProvider={routerBindings}
            notificationProvider={notificationProvider}
            resources={[
              {
                name: "users",
                list: "/users",
                show: "/users/show/:id",
                meta: {
                  canDelete: true,
                  label: "Utilisateurs",
                },
              },
              {
                name: "poles",
                list: "/poles",
                create: "/poles/create",
                edit: "/poles/edit/:id",
                meta: {
                  canDelete: true,
                  label: "Pôles",
                },
              },
              {
                name: "services",
                list: "/services",
                create: "/services/create",
                edit: "/services/edit/:id",
                meta: {
                  canDelete: true,
                  label: "Services",
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route index element={<NavigateToResource resource="users" />} />
                <Route path="/users">
                  <Route index element={<UserList />} />
                  <Route path="show/:id" element={<UserShow />} />
                </Route>
                <Route path="/poles">
                  <Route index element={<PoleList />} />
                  <Route path="create" element={<PoleCreate />} />
                  <Route path="edit/:id" element={<PoleEdit />} />
                </Route>
                <Route path="/services">
                  <Route index element={<ServiceList />} />
                  <Route path="create" element={<ServiceCreate />} />
                  <Route path="edit/:id" element={<ServiceEdit />} />
                </Route>
              </Route>
              <Route path="*" element={<ErrorComponent />} />
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
          </Refine>
        </RefineKbarProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
