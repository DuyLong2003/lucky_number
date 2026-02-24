/* eslint-disable camelcase */
/* eslint-disable dot-notation */
const qs = require('qs');
const axios = require('axios');

const wrapApi = async (req, { url, path }) => {
  const configAxios = {
    ...req,
    url: `${url}${path ?? ''}?${qs.stringify(req.query, { arrayFormat: 'brackets' })}`,
    headers: {
      'Content-Type': 'application/json',
      ...(req?.headers ?? {})
    }
  };

  if (Object.keys(req.body ?? {}).length > 0) {
    const data = JSON.stringify(req.body);
    configAxios.data = data;
    delete configAxios.body;
  }
  const response = await new Promise((resolve, reject) => {
    axios(configAxios)
      .then((resp) => resolve(resp))
      .catch((err) => reject(err));
  });
  return response.data;
};

module.exports = { wrapApi };
