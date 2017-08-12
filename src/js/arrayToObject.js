export default (array, key) => {
  let obj = {};

  for(let item of array){
    let _key = item[key];
    obj[_key] = item;
  }

  return obj;
}
