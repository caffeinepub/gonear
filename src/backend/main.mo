import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Experience level enum
  public type ExperienceLevel = { #junior; #midLevel; #senior };

  // Profile data type
  public type UserProfile = {
    name : Text;
    companyName : Text;
    jobRole : Text;
    currentCity : Text;
    preferredCity : Text;
    salaryRange : Text;
    experienceLevel : ExperienceLevel;
    verified : Bool;
  };

  // Swap request status enum
  public type SwapRequestStatus = { #pending; #accepted; #rejected };

  // Swap request data type
  public type SwapRequest = {
    id : Nat;
    from : Principal;
    to : Principal;
    status : SwapRequestStatus;
    timestamp : Int;
  };

  // Message data type
  public type Message = {
    sender : Principal;
    recipient : Principal;
    content : Text;
    timestamp : Int;
  };

  // System state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let swapRequests = Map.empty<Nat, SwapRequest>();
  var nextSwapRequestId = 0;

  let messages = Map.empty<(Principal, Principal), List.List<Message>>();

  // Helper function to check if two users have an accepted swap request
  private func hasAcceptedSwapRequest(user1 : Principal, user2 : Principal) : Bool {
    for (request in swapRequests.values()) {
      if (request.status == #accepted) {
        if ((request.from == user1 and request.to == user2) or (request.from == user2 and request.to == user1)) {
          return true;
        };
      };
    };
    return false;
  };

  // User profile management
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Matching algorithm
  public query ({ caller }) func findMatches() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can find matches");
    };

    let callerProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Profile not found") };
    };

    // Only verified users can find matches
    if (not callerProfile.verified) {
      Runtime.trap("Unauthorized: Only verified users can find matches");
    };

    let matches = List.empty<Principal>();

    for ((user, profile) in userProfiles.entries()) {
      // Only match with other verified users
      if (
        user != caller and
        profile.verified and
        profile.currentCity == callerProfile.preferredCity and
        profile.preferredCity == callerProfile.currentCity and
        profile.companyName == callerProfile.companyName and
        profile.jobRole == callerProfile.jobRole
      ) {
        matches.add(user);
      };
    };

    matches.toArray();
  };

  // Swap request management
  public shared ({ caller }) func sendSwapRequest(recipient : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send swap requests");
    };

    let senderProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Sender profile not found") };
      case (?profile) { profile };
    };

    // Only verified users can send swap requests
    if (not senderProfile.verified) {
      Runtime.trap("Unauthorized: Only verified users can send swap requests");
    };

    let recipientProfile = switch (userProfiles.get(recipient)) {
      case (null) { Runtime.trap("Recipient profile not found") };
      case (?profile) { profile };
    };

    // Can only send swap requests to verified users
    if (not recipientProfile.verified) {
      Runtime.trap("Unauthorized: Can only send swap requests to verified users");
    };

    let id = nextSwapRequestId;
    nextSwapRequestId += 1;

    let request : SwapRequest = {
      id;
      from = caller;
      to = recipient;
      status = #pending;
      timestamp = Time.now();
    };

    swapRequests.add(id, request);
  };

  public shared ({ caller }) func acceptSwapRequest(requestId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept swap requests");
    };

    switch (swapRequests.get(requestId)) {
      case (null) { Runtime.trap("Swap request not found") };
      case (?request) {
        if (request.to != caller) {
          Runtime.trap("Unauthorized: You are not the recipient of this request");
        };
        if (request.status != #pending) {
          Runtime.trap("Request is not pending");
        };

        let updatedRequest : SwapRequest = {
          id = request.id;
          from = request.from;
          to = request.to;
          status = #accepted;
          timestamp = Time.now();
        };

        swapRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func rejectSwapRequest(requestId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reject swap requests");
    };

    switch (swapRequests.get(requestId)) {
      case (null) { Runtime.trap("Swap request not found") };
      case (?request) {
        if (request.to != caller) {
          Runtime.trap("Unauthorized: You are not the recipient of this request");
        };
        if (request.status != #pending) {
          Runtime.trap("Request is not pending");
        };

        let updatedRequest : SwapRequest = {
          id = request.id;
          from = request.from;
          to = request.to;
          status = #rejected;
          timestamp = Time.now();
        };

        swapRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getSwapRequests() : async [SwapRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view swap requests");
    };

    // Users can only see swap requests they're involved in
    let userRequests = List.empty<SwapRequest>();
    for (request in swapRequests.values()) {
      if (request.from == caller or request.to == caller) {
        userRequests.add(request);
      };
    };

    userRequests.toArray();
  };

  // Messaging system
  public shared ({ caller }) func sendMessage(recipient : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Sender profile not found") };
      case (_) {};
    };

    switch (userProfiles.get(recipient)) {
      case (null) { Runtime.trap("Recipient profile not found") };
      case (_) {};
    };

    // Users can only message if they have an accepted swap request
    if (not hasAcceptedSwapRequest(caller, recipient)) {
      Runtime.trap("Unauthorized: Can only message users with accepted swap requests");
    };

    let message : Message = {
      sender = caller;
      recipient;
      content;
      timestamp = Time.now();
    };

    let key = if (caller.toText() < recipient.toText()) {
      (caller, recipient);
    } else {
      (recipient, caller);
    };

    let existingMessages = switch (messages.get(key)) {
      case (?msgList) { msgList };
      case (null) { List.empty<Message>() };
    };

    existingMessages.add(message);
    messages.add(key, existingMessages);
  };

  public query ({ caller }) func getMessagesWith(recipient : Principal) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (_) {};
    };

    // Users can only view messages if they have an accepted swap request
    if (not hasAcceptedSwapRequest(caller, recipient)) {
      Runtime.trap("Unauthorized: Can only view messages with users who have accepted swap requests");
    };

    let key = if (caller.toText() < recipient.toText()) {
      (caller, recipient);
    } else {
      (recipient, caller);
    };

    switch (messages.get(key)) {
      case (?msgList) { msgList.toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllConversations() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile not found") };
      case (_) {};
    };

    let conversationPartners = Set.empty<Principal>();

    for ((participants, _) in messages.entries()) {
      let (p1, p2) = participants;
      if (p1 == caller) {
        conversationPartners.add(p2);
      };
      if (p2 == caller) {
        conversationPartners.add(p1);
      };
    };

    conversationPartners.values().toArray();
  };

  // Admin functions
  public shared ({ caller }) func verifyProfile(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can verify profiles");
    };

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("Profile not found") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          companyName = profile.companyName;
          jobRole = profile.jobRole;
          currentCity = profile.currentCity;
          preferredCity = profile.preferredCity;
          salaryRange = profile.salaryRange;
          experienceLevel = profile.experienceLevel;
          verified = true;
        };

        userProfiles.add(user, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func blockUser(user : Principal) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can block users");
    };

    userProfiles.remove(user);

    // Remove swap requests where user is involved
    let requestsToRemove = swapRequests.entries().toArray().map(func((id, _)) { id });
    for (requestId in requestsToRemove.values()) {
      let shouldRemove = switch (swapRequests.get(requestId)) {
        case (null) { false };
        case (?request) {
          request.from == user or request.to == user;
        };
      };
      if (shouldRemove) { swapRequests.remove(requestId) };
    };

    // Remove messages where user is involved
    let messagesToRemove = messages.entries().toArray().map(func((k, _)) { k });
    for (messageKey in messagesToRemove.values()) {
      let (sender, recipient) = messageKey;
      if (sender == user or recipient == user) {
        messages.remove(messageKey);
      };
    };
  };

  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    userProfiles.toArray();
  };

  // GET for all data
  public query ({ caller }) func getAllData() : async (
    [(Principal, UserProfile)],
    [SwapRequest],
    [(Principal, Principal, [Message])],
  ) {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all data");
    };

    let allUserProfiles = userProfiles.toArray();
    let allSwapRequests = swapRequests.values().toArray();
    let allMessages = messages.entries().toArray().map(
      func((key, msgList)) {
        let (sender, recipient) = key;
        (sender, recipient, msgList.toArray());
      }
    );

    (allUserProfiles, allSwapRequests, allMessages);
  };

  // Custom Comparators for sorting
  module UserProfile {
    public func compare(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  module SwapRequest {
    public func compareByTimestamp(r1 : SwapRequest, r2 : SwapRequest) : Order.Order {
      Int.compare(r1.timestamp, r2.timestamp);
    };
  };

  module Message {
    public func compareByTimestamp(m1 : Message, m2 : Message) : Order.Order {
      Int.compare(m1.timestamp, m2.timestamp);
    };
  };

  module Pair {
    public func compare(pair1 : (Principal, Principal), pair2 : (Principal, Principal)) : Order.Order {
      switch (Principal.compare(pair1.0, pair2.0)) {
        case (#equal) { Principal.compare(pair1.1, pair2.1) };
        case (order) { order };
      };
    };
  };
};
