const SeeData: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;

  return <div>Data for {id}</div>;
};

export default SeeData;
