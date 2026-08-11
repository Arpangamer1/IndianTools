const listeners = new Set();

const notifyListeners = (session) => {
  listeners.forEach(cb => {
    try {
      cb('SIGNED_IN', session);
    } catch (e) {
      console.error(e);
    }
  });
};

class SupabaseQueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.orderCol = null;
    this.orderAscending = true;
  }

  async insert(rows) {
    try {
      const storageKey = `indiantools_${this.table}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newRows = rows.map(row => ({
        id: Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        ...row
      }));
      localStorage.setItem(storageKey, JSON.stringify([...newRows, ...existing]));
      return { data: newRows, error: null };
    } catch (e) {
      return { data: null, error: { message: e.message } };
    }
  }

  select(fields = '*') {
    return this;
  }

  eq(column, value) {
    this.filters.push({ column, value });
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderCol = column;
    this.orderAscending = ascending;
    return this;
  }

  async then(resolve, reject) {
    try {
      const storageKey = `indiantools_${this.table}`;
      let data = JSON.parse(localStorage.getItem(storageKey) || '[]');

      // Apply filters
      for (const filter of this.filters) {
        data = data.filter(row => row[filter.column] === filter.value);
      }

      // Apply ordering
      if (this.orderCol) {
        data.sort((a, b) => {
          const valA = new Date(a[this.orderCol]).getTime() || a[this.orderCol];
          const valB = new Date(b[this.orderCol]).getTime() || b[this.orderCol];
          if (valA < valB) return this.orderAscending ? -1 : 1;
          if (valA > valB) return this.orderAscending ? 1 : -1;
          return 0;
        });
      }

      resolve({ data, error: null });
    } catch (e) {
      resolve({ data: null, error: { message: e.message } });
    }
  }
}

async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const auth = {
  async getSession() {
    try {
      const session = JSON.parse(localStorage.getItem('indiantools_session'));
      return { data: { session }, error: null };
    } catch (e) {
      return { data: { session: null }, error: { message: e.message } };
    }
  },

  onAuthStateChange(callback) {
    listeners.add(callback);
    // Call immediately with the current session
    this.getSession().then(({ data: { session } }) => {
      callback('INITIAL_SESSION', session);
    });
    return {
      data: {
        subscription: {
          unsubscribe() {
            listeners.delete(callback);
          }
        }
      }
    };
  },

  async signInWithPassword({ email, password }) {
    try {
      const users = JSON.parse(localStorage.getItem('indiantools_users') || '[]');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      const hashedPassword = await hashPassword(password);
      if (!user || user.password !== hashedPassword) {
        throw new Error('Invalid email or password.');
      }
      const session = {
        user: { id: user.id, email: user.email },
        access_token: 'mock-token'
      };
      localStorage.setItem('indiantools_session', JSON.stringify(session));
      notifyListeners(session);
      return { data: { user: session.user, session }, error: null };
    } catch (e) {
      return { data: null, error: { message: e.message } };
    }
  },

  async signUp({ email, password }) {
    try {
      const users = JSON.parse(localStorage.getItem('indiantools_users') || '[]');
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('User already exists.');
      }
      const newUser = {
        id: Math.random().toString(36).substring(2, 11),
        email,
        password: await hashPassword(password)
      };
      users.push(newUser);
      localStorage.setItem('indiantools_users', JSON.stringify(users));

      // Database starts completely fresh and empty

      return { data: { user: { id: newUser.id, email: newUser.email }, session: null }, error: null };
    } catch (e) {
      return { data: null, error: { message: e.message } };
    }
  },

  async signOut() {
    try {
      localStorage.removeItem('indiantools_session');
      notifyListeners(null);
      return { error: null };
    } catch (e) {
      return { error: { message: e.message } };
    }
  },

  async signInWithOAuth({ provider }) {
    if (provider === 'google') {
      const googleEmail = 'indtool_user@gmail.com';
      let users = JSON.parse(localStorage.getItem('indiantools_users') || '[]');
      let user = users.find(u => u.email.toLowerCase() === googleEmail.toLowerCase());
      if (!user) {
        user = {
          id: 'google-mock-id',
          email: googleEmail,
          password: 'google-oauth-mock'
        };
        users.push(user);
        localStorage.setItem('indiantools_users', JSON.stringify(users));
      }
      const session = {
        user: { id: user.id, email: user.email },
        access_token: 'mock-google-token'
      };
      localStorage.setItem('indiantools_session', JSON.stringify(session));
      notifyListeners(session);
      return { data: { user: session.user, session }, error: null };
    }
    return { data: null, error: { message: `Unsupported provider: ${provider}` } };
  }
};

// Database starts completely empty without seeding mock entries

export const supabase = {
  auth,
  from(table) {
    return new SupabaseQueryBuilder(table);
  }
};
