<script lang="ts">
  import { onMount } from "svelte";
  import { supabase } from "../src/superbaseClient";
  import { FacebookLoader } from "svelte-content-loader";
  import moment from "moment";
  import { fade } from "svelte/transition";
  import { Image } from "svelte-lazy-loader";
  import type { Notify, Count } from "../src/types";

  let notification_data: Notify[] = [];
  let notification_count: Count[] = [];
  let updating = false;

  $: count = notification_count?.length;

  const useFormat = (date: string) => {
    return moment(date, "YYYYMMDD").fromNow();
  };

  const markAsRead = async () => {
    updating = true;
    await supabase
      .from("Notifications")
      .update({ status: false })
      .eq("status", true);

    getAllRecords();
    count = 0
    updating = false;
  };

  const getAllRecords = async () => {
    let { data: Notifications } = await supabase
      .from("Notifications")
      .select("*")
      .order("status", { ascending: false });
    notification_data = Notifications as Notify[];
  };

  const getAllNotificationCount = async () => {
    let { data: status } = await supabase
      .from("Notifications")
      .select("status")
      .eq("status", "TRUE");
    notification_count = status as Count[];
  };

  onMount(() => {
    getAllRecords();
    getAllNotificationCount();
  });
</script>

<!-- yRkYRYUztMaK9YKv -->

<main class:nt-op={updating} class="notify__container">
  <div class="drop-shadow">
    <header>
      <div class="count_con">
        <h3>Notifications</h3>
        <span class="notification_count">{count ?? "0"}</span>
      </div>
      {#if notification_count?.length > 0}
        <button on:click={() => markAsRead()}>Mark all as read</button>
      {/if}
    </header>

    <div class="notification__entry">
      {#if notification_data.length <= 0}
        {#each Array(7) as skeleton_list, index}
          <FacebookLoader />
        {/each}
      {:else}
        {#each notification_data as notifications (notifications.uuid)}
          <div
            transition:fade={{ duration: 500 }}
            class:flex={notifications.photo_comment}
            class="notification"
          >
            <div class:has-nt={notifications.status} class="nt-flex">
              <div>
                <Image loading="lazy" src={notifications.avatar} alt="avatar" />
              </div>

              <div class="nt-l5">
                <p class="flex">
                  {@html notifications.description}
                  {#if notifications.status}
                    <span class="nt-dot" />
                  {/if}
                </p>

                <span class="nt-date"
                  >{useFormat(notifications.created_at)}</span
                >
                {#if notifications.comment}
                  <div transition:fade={{ duration: 500 }} class="comments">
                    <div>
                      {@html notifications.comment}
                    </div>
                  </div>
                {/if}
              </div>
            </div>
            {#if notifications.photo_comment}
              <div class="photo_comment">
                <Image
                  loading="lazy"
                  src={notifications.photo_comment}
                  alt="comment"
                />
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</main>
