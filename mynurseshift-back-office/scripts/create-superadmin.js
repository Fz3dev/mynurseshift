import pkg from '@apollo/client';
const { ApolloClient, InMemoryCache, gql, createHttpLink } = pkg;
import fetch from 'cross-fetch';

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URL || 'http://localhost:3000/graphql',
  fetch
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

async function createSuperAdmin() {
  try {
    const response = await client.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        input: {
          email: "superadmin@mynurseshift.com",
          password: "SuperAdmin@123",
          firstName: "Super",
          lastName: "Admin",
          role: "SUPERADMIN",
          status: "ACTIVE"
        }
      }
    });

    console.log('Superadmin created successfully:', response.data.register.user);
  } catch (error) {
    console.error('Error creating superadmin:', error.message);
  } finally {
    process.exit();
  }
}

createSuperAdmin();
