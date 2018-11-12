const fakeAuth = {
  onAuthStateChanged: fn => {
    fn();
    return () => {};
  },
  signOut: () => Promise.resolve()
};

export default fakeAuth;
