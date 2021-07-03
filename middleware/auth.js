import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  let expired;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const isCustomAuth = token.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      expired = true;
      decodedData = jwt.verify(token, 'privateString');
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    if (expired) {
      res.status(401).json({ message: 'Your token was expired.' });
    } else {
      res.status(401).json({ message: "Can't authenticate your identity." });
    }
  }
};

export default auth;
