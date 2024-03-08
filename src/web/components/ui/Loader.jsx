const Loader = ({ isLoading }) => {
  if (!isLoading) {
    return null
  }

  return <div className="text-center p-32 animate-bounce">Loading...</div>
}

export default Loader
