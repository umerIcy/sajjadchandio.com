/* global window */
(function () {
  if (!window.__CHANDIO_SUPABASE__ || !window.__CHANDIO_SUPABASE__.url || !window.__CHANDIO_SUPABASE__.anonKey) {
    throw new Error("Missing Supabase config. Edit for-doctor/supabase-config.js");
  }
  if (!window.supabase || !window.supabase.createClient) {
    throw new Error("Supabase library not loaded.");
  }

  window.chandioSupabase = window.supabase.createClient(
    window.__CHANDIO_SUPABASE__.url,
    window.__CHANDIO_SUPABASE__.anonKey
  );

  // EHR session helper (was ehr-auth.js — inlined so one script load can’t 404)
  (function (global) {
    "use strict";

    function clearFailure() {
      global.__EHR_AUTH_FAILURE__ = null;
    }

    function setFailure(code, message) {
      global.__EHR_AUTH_FAILURE__ = { code: code, message: message || "" };
    }

    function getLastFailure() {
      return global.__EHR_AUTH_FAILURE__ || null;
    }

    async function ensureSupabaseSession(sb) {
      clearFailure();
      var cfg = global.__CHANDIO_SUPABASE__ || {};
      try {
        var cur = await sb.auth.getSession();
        if (cur.data && cur.data.session) return cur.data.session;

        var email = (cfg.authEmail || "").trim();
        var password = cfg.authPassword || "";

        if (email && password) {
          var res = await sb.auth.signInWithPassword({ email: email, password: password });
          if (res.error) {
            var msg = res.error.message || "Unknown error";
            var hint =
              " Check authEmail/authPassword, or leave both empty for Anonymous sign-in.";
            if (/not\s*confirmed|confirm/i.test(msg)) {
              hint =
                " Go to Supabase → Authentication → Users → open your user → confirm email, OR run SQL: update auth.users set email_confirmed_at = now() where email = 'your@email'; OR disable “Confirm email” under Authentication → Providers → Email. Easiest: clear authEmail and authPassword in supabase-config.js to use Anonymous sign-in.";
            }
            setFailure("signin_failed", "Supabase sign-in failed: " + msg + "." + hint);
            console.error("EHR Supabase signInWithPassword:", res.error);
            return null;
          }
          if (res.data && res.data.session) return res.data.session;
          setFailure("unknown", "Supabase: no session after email sign-in.");
          return null;
        }

        var anon = await sb.auth.signInAnonymously();
        if (anon.error) {
          setFailure(
            "anon_failed",
            "Anonymous sign-in failed: " + (anon.error.message || "Unknown") +
              ". In Supabase: Authentication → Providers → enable Anonymous. Or set authEmail + authPassword in supabase-config.js."
          );
          console.error("EHR Supabase signInAnonymously:", anon.error);
          return null;
        }
        if (anon.data && anon.data.session) return anon.data.session;

        setFailure("unknown", "Supabase: no session after anonymous sign-in.");
        return null;
      } catch (e) {
        console.error("EHR Supabase:", e);
        setFailure("error", "Supabase error: " + (e && e.message ? e.message : String(e)));
        return null;
      }
    }

    global.EHRAuth = {
      ensureSupabaseSession: ensureSupabaseSession,
      getLastFailure: getLastFailure
    };
  })(window);
})();
