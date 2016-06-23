export function help() {
  return {
    name: 'competitors',
    description: 'This command finds Yelp organization by full name and address and return a JSON of top competitors in this area.'
  };
}

export function* execute(inputStream, outputStream, params) {
  inputStream.pipe(outputStream);
}
