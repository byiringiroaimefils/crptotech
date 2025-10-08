/*
Test script for cart flow (register -> login -> add to cart -> get cart -> delete item -> get cart)
Run: node scripts/test-cart.js

This script uses global fetch (Node 18+) and manages cookies manually via headers.
Adjust the `BASE` and test user / productId as needed.
*/

const BASE = 'http://localhost:3001'

async function http(path, opts = {}){
  const res = await fetch(BASE + path, opts)
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch(e){ json = text }
  return { status: res.status, headers: Object.fromEntries(res.headers), body: json, raw: text }
}

function parseSetCookie(setCookieHeaders){
  if(!setCookieHeaders) return {}
  // setCookieHeaders can be string or array
  const arr = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders]
  const jar = {}
  for(const cookie of arr){
    const kv = cookie.split(';')[0]
    const [k,v] = kv.split('=')
    jar[k.trim()] = v
  }
  return jar
}

function jarToHeader(jar){
  return Object.entries(jar).map(([k,v])=>`${k}=${v}`).join('; ')
}

async function run(){
  console.log('1) ping server')
  const ping = await http('/')
  console.log('status', ping.status)

  const testUser = { username: 'testuser2', email: 'test+node@test.test', password: 'password123', phoneNumber: '0123456789' }

  console.log('\n2) register user (ignore conflict)')
  const reg = await http('/api/account/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(testUser) })
  console.log('register ->', reg.status, reg.body)

  console.log('\n3) login and capture cookie')
  const loginRes = await fetch(BASE + '/api/account/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: testUser.email, password: testUser.password }), redirect: 'manual' })
  const setCookie = loginRes.headers.get('set-cookie') || loginRes.headers.get('Set-Cookie')
  const cookieJar = parseSetCookie(setCookie)
  console.log('login status', loginRes.status, 'set-cookie:', setCookie)
  const loginJson = await loginRes.json().catch(()=>null)
  console.log('login body', loginJson)

  if(!cookieJar.jwtToken){
    console.error('No jwtToken cookie set. Aborting test.');
    return
  }

  const cookieHeader = jarToHeader(cookieJar)

  console.log('\n4) get products (to pick a productId)')
  const products = await http('/api/products', { headers: { Cookie: cookieHeader }})
  console.log('products status', products.status)
  let firstProductId = null
  if(Array.isArray(products.body) && products.body.length>0) firstProductId = products.body[0]._id
  console.log('picked productId', firstProductId)

  if(!firstProductId){
    console.error('No productId found in /api/products. Aborting test.')
    return
  }

  console.log('\n5) add item to cart (POST /api/cart)')
  const add = await http('/api/cart', { method: 'POST', headers: { 'Content-Type':'application/json', Cookie: cookieHeader }, body: JSON.stringify({ productId: firstProductId, quantity: 1 }) })
  console.log('add status', add.status, add.body)

  console.log('\n6) get cart (GET /api/cart)')
  const cart1 = await http('/api/cart', { headers: { Cookie: cookieHeader } })
  console.log('cart after add ->', cart1.status, cart1.body)

  console.log('\n7) delete item from cart (DELETE /api/cart/:productId)')
  const del = await http('/api/cart/' + firstProductId, { method: 'DELETE', headers: { Cookie: cookieHeader } })
  console.log('delete status', del.status, del.body)

  console.log('\n8) get cart (GET /api/cart) after deletion')
  const cart2 = await http('/api/cart', { headers: { Cookie: cookieHeader } })
  console.log('cart after delete ->', cart2.status, cart2.body)
}

run().catch(err=>{ console.error('Test script error', err) })
