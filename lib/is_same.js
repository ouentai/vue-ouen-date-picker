export default function is_same (a,b,strict=true) {
  // 配列a,bを比較する
  // 同じならture
  // strict:trueは要素の順番も同じ
  // strict:falseは要素の順番違いを許容

  // 配列でない場合はfalse
  if (!Array.isArray(a) || !Array.isArray(b)) return false ;

  // 要素数の比較
  if (a.length !== b.length) return false ;

  // strict : false
  if (!strict) {
    // 順番違いを許容
    a.sort();
    b.sort();
  }

  for (let i in a) {
    if (a[i]!==b[i]) return false ;
  }

  return true ;
}
