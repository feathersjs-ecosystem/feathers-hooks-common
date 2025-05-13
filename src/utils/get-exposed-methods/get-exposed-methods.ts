import { Service, SERVICE } from '@feathersjs/feathers';

export function getExposedMethods(service: Service) {
  const result = (service as any)[SERVICE].methods;

  if (!result || !Array.isArray(result)) {
    throw new Error(`Service does not have exposed methods`);
  }

  return result;
}
