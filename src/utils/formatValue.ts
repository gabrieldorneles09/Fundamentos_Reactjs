const formatValue = (value: number): string => {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
  // TODO

  return formattedValue;
};
export default formatValue;
