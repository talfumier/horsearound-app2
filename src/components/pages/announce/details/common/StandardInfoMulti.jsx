function StandardInfoMulti({data}) {
  if (data === null) return null;
  return (
    <div className="col-md-4 pl-4 mt-3 mb-1 w-100">
      <div>
        <h5 className="media-heading mr-4 font-weight-bold">{data.title}</h5>
        {data.paragraphs.map((para, idx) => {
          return (
            <ul key={idx} className="pl-4 mb-0">
              <h5 key={idx} style={{lineHeight: "2.3rem"}}>
                {para}
              </h5>
            </ul>
          );
        })}
      </div>
    </div>
  );
}

export default StandardInfoMulti;
