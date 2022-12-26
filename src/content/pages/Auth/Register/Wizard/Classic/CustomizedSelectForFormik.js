import { Select } from '@mui/material';

const CustomizedSelectForFormik = ({ children, form, field }) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <Select
      label="Tipo de documento"
      placeholder="Seleccione tipo de documento"
      name={name}
      value={value}
      onChange={(e) => {
        setFieldValue(name, e.target.value);
      }}
    >
      {children}
    </Select>
  );
};

export default CustomizedSelectForFormik;
