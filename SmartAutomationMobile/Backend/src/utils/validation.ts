import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  username: yup.string().required().min(3),
  password: yup.string().required().min(6),
});

export const loginSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

export const toggleDeviceSchema = yup.object().shape({
  id: yup.string().required(),
  state: yup.string().oneOf(['ON', 'OFF']).required(),
});

export const createSceneSchema = yup.object().shape({
  name: yup.string().required(),
  actions: yup
    .array()
    .of(
      yup.object().shape({
        deviceId: yup.string().required(),
        state: yup.string().oneOf(['ON', 'OFF']).required(),
      }),
    )
    .min(1)
    .required(),
});
