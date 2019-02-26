**Show Products**
----
  Returns json data about products.

* **URL**

    /api/v1/products

* **Method:**

    `GET`
* **Data Params**

    None

* **Success Response:**
    *   **Code:** 200 <br />
        **Content:** 
        ```
        {
            items: [
                {
                    productImage: "/path/to/image",
                    _id: "5c756a1ebdd47f000469f4ce",
                    name: "product name",
                    description: "product description"
                }
            ],
            amount: 1
        }
        ```

* **Sample Call:**

    ```javascript
        fetch('/api/v1/products', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then(res => res.json()).then(res => console.log(res));
    ```



