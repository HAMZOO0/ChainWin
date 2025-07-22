module.export = async () => {
   // if we are updating frontend
   if (process.env.UPDATING_FRONT_END) {
      console.log(" Updating Frontend Contract");
      await UpdatingContractAddresses();
   }
};

async function UpdatingContractAddresses() {}
