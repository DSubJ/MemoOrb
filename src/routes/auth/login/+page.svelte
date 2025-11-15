<script lang="ts">
  import { pocketbase } from '$lib/pocketbase';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  const login = async (event: SubmitEvent) => {
    event.preventDefault();
    loading = true;
    error = '';
    try {
      await pocketbase.collection('users').authWithPassword(email, password);
      window.location.href = '/admin';
    } catch (err) {
      error = 'Login fehlgeschlagen. Bitte prüfen.';
    } finally {
      loading = false;
    }
  };
</script>

<section class="auth">
  <form class="glass-panel" on:submit={login}>
    <h2>Admin Login</h2>
    <p class="hint">Nur lesen ist ohne Login möglich. Schreiben nur als Admin.</p>
    <label for="email">E-Mail</label>
    <input id="email" type="email" required bind:value={email} autocomplete="username" />

    <label for="password">Passwort</label>
    <input id="password" type="password" required bind:value={password} autocomplete="current-password" />

    {#if error}<p class="error">{error}</p>{/if}
    <button class="button" type="submit" disabled={loading}>{loading ? 'Lädt...' : 'Login'}</button>
  </form>
</section>

<style>
  .auth {
    display: flex;
    justify-content: center;
    padding: 3rem 1.5rem;
  }

  form {
    max-width: 420px;
    width: 100%;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .hint {
    margin: 0 0 8px 0;
    color: var(--color-text-muted);
  }

  .error { color: #f7a7a3; }
</style>
