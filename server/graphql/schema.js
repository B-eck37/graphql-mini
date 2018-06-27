const data = require('./model')
const {
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLNonNull,
    GraphQLID
} = require('graphql');
const axios = require('axios')

const Movie = new GraphQLObjectType({
    name: 'Movie',
    fields: () => {
        return {
            title: { type: GraphQLString },
            releaseDate: { 
                type: GraphQLString,
                resolve: movie => movie.release_date,
            }
        }
    }
})

const PersonType = new GraphQLObjectType({
    name: "Person",
    fields: () => {
        return {
            id: {
                type: GraphQLID
            },
            name: {
                type: GraphQLString
            },
            height: {
                type: GraphQLString
            },
            films: {
                type: new GraphQLList(Movie),
                resolve: personUrl => {
                    return personUrl.films.map(film => {
                        return axios.get(film).then(res => res.data)
                    })
                }
            },
        }
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => {
        return {
            people: {
                type: new GraphQLList(PersonType),
                resolve: () => data
            },
            person: {
                type: new GraphQLList()
            }
        }
    }
});

module.exports = new GraphQLSchema({ 
    query: Query 
});