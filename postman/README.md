# Postman smoke tests

The Postman collection is for smoke/E2E checks against a running API. It does not replace Maven tests.

Run locally with Newman:

```powershell
npx newman run .\postman\collections\PromoRural_Merchant_API.json -e .\postman\environments\local.postman_environment.json
```

Expected setup:

- The backend is running and reachable at `baseUrl`.
- The test merchant user exists.
- The merchant user has an associated shop.

