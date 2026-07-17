-- EZPK Request Board v31: member delete + admin reply/delete RPC functions
-- Run this entire script once in Supabase SQL Editor.

create or replace function public.delete_own_request(p_id bigint, p_password_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare deleted_count integer;
begin
  delete from public.requests
  where id = p_id and delete_password_hash = p_password_hash;
  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

create or replace function public.admin_reply_request(p_id bigint, p_reply text, p_admin_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if encode(digest(p_admin_password, 'sha256'), 'hex') <> '014fa65da224811c3197c83358176f1439be604772bdb46494b0551ae882d3ef' then
    raise exception 'Invalid admin password';
  end if;
  update public.requests
  set admin_reply = nullif(trim(p_reply), ''), reply_at = now()
  where id = p_id;
  return found;
end;
$$;

create or replace function public.admin_delete_request(p_id bigint, p_admin_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if encode(digest(p_admin_password, 'sha256'), 'hex') <> '014fa65da224811c3197c83358176f1439be604772bdb46494b0551ae882d3ef' then
    raise exception 'Invalid admin password';
  end if;
  delete from public.requests where id = p_id;
  return found;
end;
$$;

revoke all on function public.delete_own_request(bigint,text) from public;
revoke all on function public.admin_reply_request(bigint,text,text) from public;
revoke all on function public.admin_delete_request(bigint,text) from public;
grant execute on function public.delete_own_request(bigint,text) to anon, authenticated;
grant execute on function public.admin_reply_request(bigint,text,text) to anon, authenticated;
grant execute on function public.admin_delete_request(bigint,text) to anon, authenticated;
