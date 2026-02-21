import { jest } from "@jest/globals";
import request from "supertest";


// ================= PRISMA MOCK =================
const mockFindUnique = jest.fn() as jest.MockedFunction<any>;
const mockCreate = jest.fn() as jest.MockedFunction<any>;
const mockUpdate = jest.fn() as jest.MockedFunction<any>;

jest.unstable_mockModule("../src/DB/primsa.ts", () => ({
  default: {
    user: {
      findUnique: mockFindUnique,
      create: mockCreate,
      update: mockUpdate,
    },
  },
}));

// bcrypt mock

const mockCompare = jest.fn() as jest.MockedFunction<any>;
const mockHash = jest.fn() as jest.MockedFunction<any>;

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    compare: mockCompare,
    hash: mockHash,
  },
}));

// ================= REDIS MOCK =================
const mockSet = jest.fn() as jest.MockedFunction<any>;
const mockGet = jest.fn() as jest.MockedFunction<any>;
const mockIncr = jest.fn() as jest.MockedFunction<any>;
const mockExpire = jest.fn() as jest.MockedFunction<any>;
const mockDel = jest.fn() as jest.MockedFunction<any>;

jest.unstable_mockModule("../src/config/redis.ts", () => ({
  redis: {
    set: mockSet,
    get: mockGet,
    incr: mockIncr,
    expire: mockExpire,
    del: mockDel,
  },
}));


// ================= EMAIL MOCK =================
const mockSendMail = jest.fn() as jest.MockedFunction<any>;

jest.unstable_mockModule("../src/utils/nodemailer.ts", () => ({
  default: {
    sendMail: mockSendMail,
  },
}));


// ❗ IMPORTANT — mocks ke baad app import
const app = (await import("../src/app.ts")).default;


// ================= TESTS =================
describe("Auth API", () => {

  // ---------- REGISTER ----------
  describe("Register", () => {

    test("should register user successfully", async () => {

      mockFindUnique.mockResolvedValue(null);

      mockCreate.mockResolvedValue({
        id: "1",
        email: "test@gmail.com",
      });

      const res = await request(app).post("/api/auth").send({
        name: "Amar",
        email: "test@gmail.com",
        password: "password1",
        action: "register",
      });

      expect(res.statusCode).toBe(201);
      expect(mockCreate).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalled();
    });


    test("should fail if email already exists", async () => {

      mockFindUnique.mockResolvedValue({
        id: "1",
        email: "test@gmail.com",
        password: "hashed",
        isVerified: true,
      });

      const res = await request(app).post("/api/auth").send({
        name: "Amar",
        email: "test@gmail.com",
        password: "password1",
        action: "register",
      });

      expect(res.statusCode).toBe(400);
    });

  });



  // ---------- LOGIN ----------
  describe("Login", () => {

    test("should login user", async () => {

  mockIncr.mockResolvedValue(1); //Yaha 1 ka matlab hai → login attempts count.

  // ⭐ password match fake
  mockCompare.mockResolvedValue(true);

  mockFindUnique.mockResolvedValue({
    id: "1",
    email: "test@gmail.com",
    password: "hashed",
    isVerified: true,
  });

  const res = await request(app).post("/api/auth").send({
    email: "test@gmail.com",
    password: "password1",
    action: "login",
  });

  expect(res.statusCode).toBe(200);
  expect(mockUpdate).toHaveBeenCalled();
});


  });

});

// Sirf ek file run karni ho 
// npm test auth.login
// npx jest test/auth.login.test.ts

// jest.fn() 
// Fake function banata hai.
// Real Prisma call nahi
// Fake DB function

// 2️⃣ jest.unstable_mockModule() 👉 Real file ko replace karta hai fake se.
// Controller → prisma import kare
// But actual → fake prisma mile

// 3️⃣ mockResolvedValue() Async function ka fake result.

// 4️⃣ request(app).post()
// request(app).post("/api/auth")
// 👉 API hit kar raha without browser.
// server start nahi
// direct route call

// 5️⃣ describe()
// Tests group karta.
// Example:
// Register group
// Login group

// 6️⃣ test()
// test("should login user", async () => {})
// 👉 Actual test case.
// Matlab:
// Ye scenario check karo.

// 7️⃣ expect()
// expect(res.statusCode).toBe(200)
// 👉 Result verify.
// Matlab:
// API success aaya ya nahi.

// 8️⃣ toHaveBeenCalled()
// expect(mockCreate).toHaveBeenCalled()


// 👉 Check karta function call hua ya nahi.

// Example:

// user create hua

// email send hua

// redis set hua