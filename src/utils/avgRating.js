export default function GetAvgRating(ratingArr) {
  console.log("ratingArr debug = ", ratingArr);
ratingArr.forEach(r => console.log("each rating =", r.rating));
    if (!Array.isArray(ratingArr) || ratingArr.length === 0) return 0
    const totalReviewCount = ratingArr.reduce((acc, curr) => {
      acc += curr.rating
      return acc
    }, 0)
    const multiplier = Math.pow(10, 1)
    const avgReviewCount =
      Math.round((totalReviewCount / ratingArr.length) * multiplier) / multiplier
  
    return avgReviewCount
  }