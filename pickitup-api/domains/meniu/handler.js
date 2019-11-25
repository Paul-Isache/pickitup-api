'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { mapResponse } = require('../helpers/http')
const { cognitoId } = require('../helpers/cognito')

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const data = JSON.parse(event.body);

    if (typeof data.name !== 'string') {
        console.error('Validation Failed')
        return callback(null, mapResponse(400, { 'Content-Type': 'text/plain' }, 'Couldn\'t create the todo item.'))
    }

    const params = {
        TableName: process.env.DYNAMODB_PICKITUP,
        Item: {
            id: uuid.v1(),
            vendorId: cognitoId(event),
            name: data.name,
            description: '',
            create: Date.now()
        },
    };

    // write the todo to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error)
            return callback(null, mapResponse(error.statusCode || 501, { 'Content-Type': 'text/plain' }, 'Couldn\'t create item.'))            
        }

        callback(null, mapResponse(JSON.stringify(params.Item)))
    });
};