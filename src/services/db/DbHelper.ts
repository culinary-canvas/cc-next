export function getFirstAsJson(
  snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>,
) {
  const doc = snapshot.size === 0 ? null : snapshot.docs[0]
  return JSON.parse(JSON.stringify({ id: doc.id, ...doc.data() }))
}

export function getListAsJson(
  snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>,
) {
  return snapshot.docs.map((doc) =>
    JSON.parse(JSON.stringify({ id: doc.id, ...doc.data() })),
  )
}
