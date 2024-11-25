import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.GRAPHQL_URL || 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
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
          role: "SUPERADMIN"
        }
      }
    });

    console.log('Superadmin created successfully:', response.data.register.user);
  } catch (error) {
    console.error('Error creating superadmin:', error.message);
  }
}

createSuperAdmin();
