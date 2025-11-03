// Mock simple pour bcrypt
const hash = (password, rounds) => 
  Promise.resolve(`hashed_${password}`);

const compare = (password, hash) => {
  if (hash && hash.startsWith('hashed_')) {
    const original = hash.replace('hashed_', '');
    return Promise.resolve(password === original);
  }
  return Promise.resolve(false);
};

const genSalt = () => Promise.resolve('salt');
const hashSync = (password) => `hashed_${password}`;
const compareSync = (password, hash) => {
  if (hash && hash.startsWith('hashed_')) {
    const original = hash.replace('hashed_', '');
    return password === original;
  }
  return false;
};

export { hash, compare, genSalt, hashSync, compareSync };
export default { hash, compare, genSalt, hashSync, compareSync };
