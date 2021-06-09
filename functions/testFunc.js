var userFunc = require("./userFunc");

async function main(){
    
    var user_credentials = {
        id: 1
    }

    let policy_inserted = await userFunc.addUserToPolicy(user_credentials, 2, 9, 0, 0);
    console.log("The policy inserted is");
    console.log(policy_inserted);
}

if(require.main == module){
    main();
}
