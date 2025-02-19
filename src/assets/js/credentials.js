export class Credentializer {
  #credentials = {
    "fka-kafka": {
      publicKey: import.meta.env.VITE_KAFKA_PUBLIC_KEY,
      serviceID: import.meta.env.VITE_KAFKA_SERVICE_ID,
      templateID: import.meta.env.VITE_KAFKA_TEMPLATE_ID,
      authKey: import.meta.env.VITE_KAFKA_AUTH_KEY,
    },
    "Tevstark": {
      publicKey: import.meta.env.VITE_STARK_PUBLIC_KEY,
      serviceID: import.meta.env.VITE_STARK_SERVICE_ID,
      templateID: import.meta.env.VITE_STARK_TEMPLATE_ID,
      authKey: import.meta.env.VITE_STARK_AUTH_KEY,
    },
  };

  credentialize(projectLead) {
    const creds = this.#credentials[projectLead];
    if (!creds) throw new Error(`No credentials found for ${projectLead}`);
    return creds;
  }
}
