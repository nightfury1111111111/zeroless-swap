const formatTimeString = (timeString) => {
  // eslint-disable-next-line no-useless-escape
  const dateArray = timeString.split(/[- :\/]/)
  const date = new Date(
    `${dateArray[1]}/${dateArray[2]}/${dateArray[0]} ${dateArray[3]}:${dateArray[4]}:${dateArray[5]} UTC`,
  )
  return date.toString().split('GMT')[0]
}

export default formatTimeString
