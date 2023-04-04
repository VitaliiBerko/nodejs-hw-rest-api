const request = require("supertest");

const app = require("../../server");

describe("POST users/login", () => {
  it("should returt status 200 and token", async () => {
    const testData = {
      email: "example1@example.com",
      password: "examplepassword",
    };

    const response = await request(app).post("api/users/login").send(testData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
        //   subscription: expect.any(String)
      })
    );
  });

  it("should return uunauthorized error", async () => {
    const testData = {
      email: "example1@example.com",
      password: "examplepassword",
    };

    const response = await request(app).post("app/users/login").send(testData);

    expect(response.statusCode).toBe(401);
  });
});
