import type { Request, Response } from "express"; //"verbatimModuleSyntax": true
// import { Request, Response } from "express"; normal import  "verbatimModuleSyntax": false
// import user from "../model/user.model.js"



const auth = async (req: Request, res: Response): Promise<Response> => {

  const { name, email, password, action } = req.body;

  if (action === "register") {
    if (!name || !email || !password) {
      return res.status(401).json({ message: "all fields are required" });
    }
    console.log("name:",name)
    console.log("email:",email)
    console.log("password:",password)

    return res.status(201).json({
  name,   
  email,
  password
});

  }

  if (action === "login") {
    if (!name || !email ) {
      return res.status(401).json({ message: "all fields are required" });
    }
    console.log("email:",email)
    console.log("password:",password)
  }

  return res.status(200).json({ message: "ok" });
};

export {
    auth
}


// Case	Return type
// return res.json() karte ho	Promise<Response>
// sirf res.json() call karte ho	Promise<void>