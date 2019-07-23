export default class Utils {
  static createSendTransaction(actor, permission = 'active') {
    const transaction = {
      account: 'eosio.token',
      name: 'transfer',
      authorization: [
        {
          actor,
          permission
        }
      ],
      data: {
        from: actor,
        to: actor,
        quantity: '0.0001 EOS',
        memo: `random number: ${Math.random()}`
      }
    };
    return transaction;
  }

  static createSampleTransaction(actor, permission = 'active') {
    const transaction = {
      account: 'demoapphello',
      name: 'hi',
      authorization: [{
        actor,
        permission
      }],
      data: {
        user: actor
      }
    };
    return transaction;
  }
}
