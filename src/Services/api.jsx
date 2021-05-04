// const magicPotionsApi =
// "https://magic-potions-backend-api.herokuapp.com/api/v1/api/magic";
const magicPotionsApi = "http://localhost:3000/api/v1/api/magic";

const headers = () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

// ******* POST Order Call *********

export async function postOrder(orderData) {
  // no Auth needs to be implemented on backend
  const resp = await fetch(`${magicPotionsApi}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(orderData),
  });
  return await resp.json();
}
