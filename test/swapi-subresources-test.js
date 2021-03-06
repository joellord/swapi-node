'use strict';

const nock = require('nock');
const swapi = require('../lib/swapi-node.js');
const {version} = require('../package.json');
const test = require('tape');

nock.disableNetConnect();

test('property with link should have a corresponding getter', async t => {
  nock('https://swapi.co/api/')
    .matchHeader('User-Agent', 'swapi-node')
    .matchHeader('SWAPI-Node-Version', version)
    .get('/people/1')
    .reply(200, {
      name: 'Luke Skywalker',
      homeworld: 'https://swapi.co/api/planets/1/'
    });

  const result = await swapi.getPerson(1);
  t.equal((typeof result.getHomeworld === 'function'), true, 'should be a function');

  nock('https://swapi.co/api/')
    .matchHeader('User-Agent', 'swapi-node')
    .matchHeader('SWAPI-Node-Version', version)
    .get('/planets/1/')
    .reply(200, {
      name: 'Tatooine'
    });

  await result.getHomeworld();
  t.ok('succes returned');
  t.end();
});

test('property with out link should have a corresponding getter anyway', async t => {
  nock('https://swapi.co/api/')
    .matchHeader('User-Agent', 'swapi-node')
    .matchHeader('SWAPI-Node-Version', version)
    .get('/people/1')
    .reply(200, {
      name: 'Luke Skywalker',
      homeworld: 'https://swapi.co/api/planets/1/'
    });

  const result = await swapi.getPerson(1);
  t.equal((typeof result.getName === 'function'), true, 'should be a function');

  const personResult = await result.getName();
  t.equal(personResult, 'Luke Skywalker', 'should equal');
  t.end();
});
