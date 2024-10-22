import User from "../../classes/User.js";

export const user = new Map();

const mapFiller = (data) => {
    console.log("!!!", data);
    // for (let item of data) {
    //     let tmpProduct = new User(item.id, item.name, item.description);

    //     // const option = document.createElement("option");
    //     // option.innerText = tmpProduct.name;
    //     // option.value = tmpProduct.id;
    //     // user.set(tmpProduct.id, tmpProduct);
    //     console.log(tmpProduct);
    //     // document.querySelector("#categoryList").append(option);
    // }
};

load("http://127.0.0.1:5500/const/user_data.json", mapFiller);
