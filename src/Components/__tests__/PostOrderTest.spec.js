import { postOrder } from "../../Services/api";

const orderParams = [
  {
    email: "casado564jo718@gmail.com",
    quantity: "2",
    total: "89.98",
    payment: {
      credit_card_number: "0987123409871234",
      credit_card_exp: "04/23",
    },
  },
];

const orderId = 4;
describe("post route", () => {
  it("should return status code 201 and a unique ID as response", async () => {
    // Mock API
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 201,
            data: orderId,
          }),
      })
    );

    const result = await postOrder();

    expect(result.status).toBe(201);
    expect(result.data).toBe(orderId);
  });

  it("should catch error", async () => {
    // Mock API
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: 422,
            error: "Already Exists",
          }),
      })
    );

    const result = await postOrder();

    expect(result.status).toBe(422);
    expect(result.error).toBe("Already Exists");
  });
});
