// const axios = require('axios').default
// const axiosCookieJarSupport = require('axios-cookiejar-support').default
// const tough = require('tough-cookie')
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import tough from 'tough-cookie'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

const riotClient = axios.create({
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})

axiosCookieJarSupport(riotClient)

const cookieJar = new tough.CookieJar()

async function makeAuthorizationCookie () {
  return await riotClient.post('https://auth.riotgames.com/api/v1/authorization', {
    client_id: 'play-valorant-web-prod',
    nonce: 1,
    redirect_uri: 'https://beta.playvalorant.com/opt_in',
    response_type: 'token id_token',
    scope: 'account openid'
  }, {
    jar: cookieJar
  })
}

async function getAccessToken (username, password) {
  const response = await riotClient.put('https://auth.riotgames.com/api/v1/authorization', {
    type: 'auth',
    username,
    password
  }, {
    jar: cookieJar
  })

  const accessTokenResponse = response.data.response.parameters.uri
  const responseParams = accessTokenResponse.replace('https://beta.playvalorant.com/opt_in#', '')
  const responseParsed = new URLSearchParams(responseParams)
  const accessToken = responseParsed.get('access_token')

  return accessToken
}

async function getUserID (accessToken) {
  const response = await riotClient.post('https://auth.riotgames.com/userinfo', {}, {
    headers: { Authorization: `Bearer ${accessToken}` },
    jar: cookieJar
  })

  const userID = response.data.sub
  return userID
}

async function getEntitlementsJWT (accessToken) {
  const response = await riotClient.post('https://entitlements.auth.riotgames.com/api/token/v1', {}, {
    headers: { Authorization: `Bearer ${accessToken}` },
    jar: cookieJar
  })

  const entitlementsToken = response.data.entitlements_token
  return entitlementsToken
}

async function getLastMatches (accessToken, entitlementsToken, userId, startIndex = 0, endIndex = 20) {
  const response = await riotClient.get(`https://pd.eu.a.pvp.net/mmr/v1/players/${userId}/competitiveupdates?startIndex=${startIndex}&endIndex=${endIndex}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Riot-Entitlements-JWT': entitlementsToken
    }
  })

  const matches = response.data.Matches
  return matches
}

async function entryPoint (username, password, count = 1) {
  await cookieJar.removeAllCookies()
  await makeAuthorizationCookie()
  const accessToken = await getAccessToken(username, password)
  const userId = await getUserID(accessToken)
  const entitlementsToken = await getEntitlementsJWT(accessToken)

  const matches = await getLastMatches(accessToken, entitlementsToken, userId, 0, count)

  return matches
}

async function staticLink (accessToken, count = 1) {
  await cookieJar.removeAllCookies()
  await makeAuthorizationCookie()
  const userId = await getUserID(accessToken)
  const entitlementsToken = await getEntitlementsJWT(accessToken)
  const matches = await getLastMatches(accessToken, entitlementsToken, userId, 0, count)
  return matches
}

async function onlyAccessToken (username, password) {
  await cookieJar.removeAllCookies()
  await makeAuthorizationCookie()
  const accessToken = await getAccessToken(username, password)

  return accessToken
}

export const leakDynamic = entryPoint
export const leakStatic = staticLink
export const leakToken = onlyAccessToken
